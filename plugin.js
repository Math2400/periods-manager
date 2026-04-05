/**
 * Periods Manager Plugin - plugin.js
 * Handles timer interception and period-aware task selection.
 * Data model is shared with index.html via persistDataSynced/loadSyncedData.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Get day-of-week index (0 = Monday … 6 = Sunday) for a Date */
function dayIndex(d) {
  return (d.getDay() + 6) % 7;
}

/** Parse "HH:MM" → minutes since midnight */
function parseTime(str) {
  var parts = str.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

/** Load persisted data (periods, timetables, etc.) */
async function loadData() {
  try {
    var raw = await PluginAPI.loadSyncedData();
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return { periods: {}, timetables: {}, dailyOverrides: {}, activeTimetableId: null };
}

/**
 * Given the full data object and the current Date, return the ordered list of
 * period objects that apply right now (considering daily overrides and the active timetable).
 */
function getEffectivePeriods(data, now) {
  var dateStr =
    now.getFullYear() +
    '-' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(now.getDate()).padStart(2, '0');

  // 1. Daily override wins
  if (data.dailyOverrides && data.dailyOverrides[dateStr]) {
    return data.dailyOverrides[dateStr].periods || [];
  }

  // 2. Active timetable for this weekday
  if (data.activeTimetableId && data.timetables && data.timetables[data.activeTimetableId]) {
    var tt = data.timetables[data.activeTimetableId];
    var dow = dayIndex(now); // 0=Mon
    if (tt.days && tt.days[dow]) {
      return tt.days[dow].periods || [];
    }
  }

  // 3. Fallback: manual periods for today
  if (data.periods && data.periods[dateStr]) {
    return data.periods[dateStr] || [];
  }

  return [];
}

/**
 * Find the period that contains the current time.
 */
function findCurrentPeriod(periods, now) {
  var mins = now.getHours() * 60 + now.getMinutes();
  for (var i = 0; i < periods.length; i++) {
    var p = periods[i];
    var start = parseTime(p.startTime);
    var end = parseTime(p.endTime);
    if (mins >= start && mins < end) {
      return p;
    }
  }
  return null;
}

// ── Timer interception ───────────────────────────────────────────────────────

PluginAPI.registerHook(PluginAPI.Hooks.ACTION, async function (payload) {
  if (!payload || !payload.action) return;
  // Intercept the toggleStart action
  if (payload.action !== '[Task] Toggle start') return;

  try {
    var data = await loadData();
    var now = new Date();
    var periods = getEffectivePeriods(data, now);
    var currentPeriod = findCurrentPeriod(periods, now);

    if (!currentPeriod || !currentPeriod.taskIds || currentPeriod.taskIds.length === 0) {
      // No period or no tasks — let the default behaviour run
      return;
    }

    // Get all tasks to find the first undone task in this period
    var allTasks = await PluginAPI.getTasks();
    var tasksMap = {};
    for (var i = 0; i < allTasks.length; i++) {
      tasksMap[allTasks[i].id] = allTasks[i];
    }

    // Find first undone task in the current period
    var targetTaskId = null;
    for (var j = 0; j < currentPeriod.taskIds.length; j++) {
      var tid = currentPeriod.taskIds[j];
      var t = tasksMap[tid];
      if (t && !t.isDone) {
        targetTaskId = tid;
        break;
      }
    }

    if (targetTaskId) {
      // Dispatch setCurrentTask to start the right task
      PluginAPI.dispatchAction({
        type: '[Task] SetCurrentTask',
        id: targetTaskId,
      });
    }
    // If all tasks in the period are done, let default behaviour pick next task
  } catch (e) {
    // Silently fail — don't break the timer
  }
});

// ── UI Registration ──────────────────────────────────────────────────────────


PluginAPI.registerShortcut({
  id: 'show_periods',
  label: 'Show Periods Manager',
  onExec: function () {
    PluginAPI.showIndexHtmlAsView();
  },
});
