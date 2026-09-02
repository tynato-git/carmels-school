# AdminDashboard.jsx — patch guide

Two additions needed. Both are small, additive, copy-paste snippets.
No existing code needs to be removed.

---

## 1. Add `class_level` to the topper form

**Find** the `topperForm` state initializer near the top:

```js
const [topperForm, setTopperForm] = useState({
  rank: 'Rank 1',
  percentage: '98.0%',
  name: '',
  photo_url: '',
  total_score: '588 / 600',
  stream: 'Biology & Physics Stream',
  badge_color: 'gold',
  centums: 'Mathematics: 100/100\nBiology: 100/100\nChemistry: 100/100',
  display_order: 1,
  is_active: true
});
```

**Replace with** (adds `class_level: 'XII'` default):

```js
const [topperForm, setTopperForm] = useState({
  rank: 'Rank 1',
  percentage: '98.0%',
  name: '',
  photo_url: '',
  total_score: '588 / 600',
  stream: 'Biology & Physics Stream',
  badge_color: 'gold',
  class_level: 'XII',
  centums: 'Mathematics: 100/100\nBiology: 100/100\nChemistry: 100/100',
  display_order: 1,
  is_active: true
});
```

**In `handleOpenAddTopperModal`**, add `class_level: 'XII'` to the reset object (same spot as above, inside the function).

**In `handleOpenEditTopperModal`**, add this line alongside the other `ach.xxx || ...` assignments:

```js
class_level: ach.class_level || 'XII',
```

**In `handleSaveTopper`**, both the `.update({...})` and `.insert([{...}])` payloads need `class_level: topperForm.class_level,` added alongside `badge_color: topperForm.badge_color,`.

**In the Topper modal JSX**, inside the `form-grid-3col` div that has Rank / Percentage / Badge Color, add a 4th field (or put it in its own row) right after the Badge Color `<select>`:

```jsx
<div className="admin-input-group">
  <label htmlFor="topper-class-level">Class Level *</label>
  <select
    id="topper-class-level"
    className="admin-select"
    value={topperForm.class_level}
    onChange={(e) => setTopperForm({ ...topperForm, class_level: e.target.value })}
  >
    <option value="XII">Std XII (HSC Board)</option>
    <option value="X">Std X (SSLC Board)</option>
  </select>
</div>
```

> Note: if you keep this 4th field inside `form-grid-3col`, change that container's class to `form-grid-2col` wrapping two rows, or just drop it into its own `<div className="form-grid-2col">` right below — either works visually, it's a minor layout choice.

Optionally, also show the class level as a small tag on each `admin-topper-card` in the Results tab list, e.g. right under the rank badge:

```jsx
<span className="table-dept-pill" style={{ marginBottom: '0.5rem' }}>
  {ach.class_level === 'X' ? 'Std X · SSLC' : 'Std XII · HSC'}
</span>
```

---

## 2. Add a "Results Announcement Banner" settings block

This is a new mini-form inside the existing `activeTab === 'results'` pane,
so admins can edit the popup's ribbon/heading/centum-summary text without
touching code. It talks to the new `results_announcement` table from the
SQL migration.

### 2a. New state (add near the other Results state, e.g. below `resultsSuccess`)

```js
const [announcement, setAnnouncement] = useState(null);
const [announcementForm, setAnnouncementForm] = useState({
  is_active: true,
  academic_year: '2025 – 2026',
  ribbon_text: '100% RESULTS',
  ribbon_sub: 'BOARD PASS RATE',
  congrats_heading: '🎉 Congratulations! 🎉',
  congrats_sub: 'ACADEMIC BOARD TOPPERS & HIGH ACHIEVERS',
  centums_xii: '',
  centums_x: '',
  motto_text: 'Your hard work, dedication and perseverance have made us proud.',
  motto_bold: 'KEEP STRIVING FOR EXCELLENCE!'
});
const [announcementSaving, setAnnouncementSaving] = useState(false);
```

### 2b. Fetch it inside `fetchResultsData` — add this to the `Promise.all` array

Change:

```js
const [statsRes, toppersRes] = await Promise.all([
  supabase.from('result_stats').select('*').order('display_order', { ascending: true }),
  supabase.from('academic_toppers').select('*').order('display_order', { ascending: true })
]);
```

to:

```js
const [statsRes, toppersRes, annRes] = await Promise.all([
  supabase.from('result_stats').select('*').order('display_order', { ascending: true }),
  supabase.from('academic_toppers').select('*').order('display_order', { ascending: true }),
  supabase.from('results_announcement').select('*').limit(1).maybeSingle()
]);
```

and in the `else` block right below, add:

```js
if (annRes.data) {
  setAnnouncement(annRes.data);
  setAnnouncementForm({ ...announcementForm, ...annRes.data });
}
```

### 2c. Save handler — add anywhere near `handleSaveStat`

```js
const handleSaveAnnouncement = async (e) => {
  e.preventDefault();
  setAnnouncementSaving(true);
  try {
    const payload = { ...announcementForm, updated_at: new Date().toISOString() };
    if (announcement?.id) {
      const { error } = await supabase
        .from('results_announcement')
        .update(payload)
        .eq('id', announcement.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('results_announcement')
        .insert([payload])
        .select();
      if (error) throw error;
      if (data && data[0]) setAnnouncement(data[0]);
    }
    setResultsSuccess('Results announcement banner updated!');
  } catch (err) {
    alert('Error saving announcement: ' + err.message);
  } finally {
    setAnnouncementSaving(false);
  }
};
```

### 2d. JSX block — paste this inside the Results tab pane, right after the
opening `<div className="tab-pane">` view-header block (i.e. before the
"4 Stat Highlights" `results-admin-section-block`):

```jsx
<div className="results-admin-section-block">
  <div className="section-block-header">
    <h3 className="section-block-title">
      <Sparkles size={18} className="text-primary-blue" />
      Results Announcement Popup
    </h3>
    <span className="section-block-hint">Controls the pop-up banner shown to visitors on page load</span>
  </div>

  <form onSubmit={handleSaveAnnouncement} className="school-info-admin-form">
    <div className="form-grid-3col">
      <div className="admin-input-group">
        <label>Academic Year</label>
        <input
          type="text"
          value={announcementForm.academic_year}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, academic_year: e.target.value })}
        />
      </div>
      <div className="admin-input-group">
        <label>Ribbon Text</label>
        <input
          type="text"
          value={announcementForm.ribbon_text}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, ribbon_text: e.target.value })}
        />
      </div>
      <div className="admin-input-group">
        <label>Ribbon Subtitle</label>
        <input
          type="text"
          value={announcementForm.ribbon_sub}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, ribbon_sub: e.target.value })}
        />
      </div>
    </div>

    <div className="form-grid-2col">
      <div className="admin-input-group">
        <label>Congrats Heading</label>
        <input
          type="text"
          value={announcementForm.congrats_heading}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, congrats_heading: e.target.value })}
        />
      </div>
      <div className="admin-input-group">
        <label>Congrats Subtitle</label>
        <input
          type="text"
          value={announcementForm.congrats_sub}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, congrats_sub: e.target.value })}
        />
      </div>
    </div>

    <div className="form-grid-2col">
      <div className="admin-input-group">
        <label>Std XII Centum Summary</label>
        <input
          type="text"
          placeholder="Maths – 14 | CS – 11 | Physics – 8"
          value={announcementForm.centums_xii}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, centums_xii: e.target.value })}
        />
      </div>
      <div className="admin-input-group">
        <label>Std X Centum Summary</label>
        <input
          type="text"
          placeholder="Science – 12 | Social Science – 10"
          value={announcementForm.centums_x}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, centums_x: e.target.value })}
        />
      </div>
    </div>

    <div className="form-grid-2col">
      <div className="admin-input-group">
        <label>Motto Line (italic)</label>
        <input
          type="text"
          value={announcementForm.motto_text}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, motto_text: e.target.value })}
        />
      </div>
      <div className="admin-input-group">
        <label>Motto Bold Line</label>
        <input
          type="text"
          value={announcementForm.motto_bold}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, motto_bold: e.target.value })}
        />
      </div>
    </div>

    <div className="form-grid-2col">
      <div className="admin-checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={announcementForm.is_active}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, is_active: e.target.checked })}
          />
          <span>Show popup to website visitors</span>
        </label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-admin-primary" disabled={announcementSaving}>
          {announcementSaving ? 'Saving...' : 'Save Announcement Banner'}
        </button>
      </div>
    </div>
  </form>
</div>
```

> `Sparkles` is already imported at the top of `AdminDashboard.jsx` (see the
> lucide-react import list), so no new import is needed.

---

## That's it

After these two patches + running the SQL migration + swapping in the new
`ToppersModal.jsx` + appending `ToppersModal.additions.css`:

- Editing a topper's rank/photo/marks/stream in the dashboard updates the
  popup immediately (same table, no more duplicate hardcoded data).
- Setting `class_level` to `X` or `XII` per topper controls which section
  of the popup they appear in.
- The new "Results Announcement Popup" block lets admins edit the ribbon,
  heading, centum-summary strings, and toggle the whole popup on/off —
  all without a code deploy.
