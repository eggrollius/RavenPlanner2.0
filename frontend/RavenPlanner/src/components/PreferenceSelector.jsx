import './PreferenceSelector.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const timeOptions = [];
const startMinutes = 8 * 60 + 35;
const endMinutes = 21 * 60 + 55;
for (let minutes = startMinutes; minutes <= endMinutes; minutes += 15) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const formatted = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  const ampmHour = hours % 12 === 0 ? 12 : hours % 12;
  const label = `${ampmHour}:${mins.toString().padStart(2, '0')}${hours < 12 ? 'am' : 'pm'}`;
  timeOptions.push({ value: formatted, label });
}

const PreferenceSelector = ({ preferences, onChange }) => {
  const { avoidBeforeTime = '', avoidAfterTime = '', avoidDays = [] } = preferences;

  const handleBeforeTimeChange = (event) => {
    onChange({
      ...preferences,
      avoidBeforeTime: event.target.value,
    });
  };

  const handleAfterTimeChange = (event) => {
    onChange({
      ...preferences,
      avoidAfterTime: event.target.value,
    });
  };

  const toggleDay = (day) => {
    const newAvoidDays = avoidDays.includes(day)
      ? avoidDays.filter((currentDay) => currentDay !== day)
      : [...avoidDays, day];

    onChange({
      ...preferences,
      avoidDays: newAvoidDays,
    });
  };

  return (
    <div className="preference-selector">
      <div className="preference-header">
        <h2>Schedule Preferences</h2>
        <p>Adjust your schedule preferences to avoid early, late, or specific day classes.</p>
      </div>

      <div className="preference-section">
        <div className="preference-row">
          <label className="preference-label" htmlFor="avoid-before-time">
            Avoid classes before
          </label>
          <select
            id="avoid-before-time"
            value={avoidBeforeTime}
            onChange={handleBeforeTimeChange}
            className="preference-time-input"
          >
            <option value="">No preference</option>
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="preference-row">
          <label className="preference-label" htmlFor="avoid-after-time">
            Avoid classes after
          </label>
          <select
            id="avoid-after-time"
            value={avoidAfterTime}
            onChange={handleAfterTimeChange}
            className="preference-time-input"
          >
            <option value="">No preference</option>
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="preference-section">
        <div className="preference-label">Avoid classes on</div>
        <div className="preference-days-grid">
          {daysOfWeek.map((day) => {
            const selected = avoidDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                className={`preference-day-button ${selected ? 'selected' : ''}`}
                onClick={() => toggleDay(day)}
                aria-pressed={selected}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PreferenceSelector;
