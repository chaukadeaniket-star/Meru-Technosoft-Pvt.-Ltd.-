import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Activity, ArrowDownUp, BriefcaseBusiness, Check, ChevronDown, CircleHelp, Command, Download, LayoutDashboard, ListFilter, LoaderCircle, Mail, MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, Sparkles, Target, Trash2, Users, X } from 'lucide-react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const api = axios.create({ baseURL: API_URL })
const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost']
const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Event', 'Other']
const EMPTY_FORM = { name: '', email: '', phone: '', company: '', source: 'Website', status: 'New' }
const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
const TODAY_LABEL = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())

function App() {
  const [leads, setLeads] = useState([])
  const [allLeads, setAllLeads] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')

  const loadLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (search.trim()) params.search = search.trim()
      if (statusFilter) params.status = statusFilter
      const [filtered, all] = await Promise.all([api.get('/leads', { params }), api.get('/leads')])
      setLeads(filtered.data.data)
      setAllLeads(all.data.data)
      setApiError('')
    } catch (error) {
      setApiError(error.response?.data?.message || 'The API could not be reached. Start the server and check your database connection.')
    } finally { setLoading(false) }
  }, [search, statusFilter])

  useEffect(() => {
    const timer = setTimeout(loadLeads, 250)
    return () => clearTimeout(timer)
  }, [loadLeads])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  const counts = useMemo(() => ({
    Total: allLeads.length,
    New: allLeads.filter((lead) => lead.status === 'New').length,
    Contacted: allLeads.filter((lead) => lead.status === 'Contacted').length,
    Qualified: allLeads.filter((lead) => lead.status === 'Qualified').length,
    Lost: allLeads.filter((lead) => lead.status === 'Lost').length,
  }), [allLeads])

  function openCreate() {
    setEditingLead(null); setForm(EMPTY_FORM); setFormError(''); setModalOpen(true)
  }
  function openEdit(lead) {
    setEditingLead(lead)
    setForm({ name: lead.name, email: lead.email, phone: lead.phone, company: lead.company, source: lead.source, status: lead.status })
    setFormError(''); setModalOpen(true)
  }
  async function saveLead(event) {
    event.preventDefault(); setSaving(true); setFormError('')
    try {
      if (editingLead) await api.put(`/leads/${editingLead._id}`, form)
      else await api.post('/leads', form)
      setModalOpen(false); setToast(editingLead ? 'Lead details updated' : 'New lead added')
      await loadLeads()
    } catch (error) {
      setFormError(error.response?.data?.errors?.map((item) => item.message).join(' ') || error.response?.data?.message || 'Could not save this lead. Please try again.')
    } finally { setSaving(false) }
  }
  async function deleteLead(lead) {
    if (!window.confirm(`Delete ${lead.name}'s lead? This action cannot be undone.`)) return
    try { await api.delete(`/leads/${lead._id}`); setToast('Lead deleted'); await loadLeads() }
    catch (error) { setToast(error.response?.data?.message || 'Could not delete this lead') }
  }

  const statCards = [
    { label: 'Total leads', value: counts.Total, icon: Users, tone: 'violet', delta: 'Across your pipeline' },
    { label: 'New leads', value: counts.New, icon: Sparkles, tone: 'blue', delta: 'Ready for first contact' },
    { label: 'Contacted', value: counts.Contacted, icon: Activity, tone: 'amber', delta: 'Conversations started' },
    { label: 'Qualified', value: counts.Qualified, icon: Target, tone: 'green', delta: 'High intent prospects' },
  ]

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="Meru home"><span className="brand-mark"><Command size={19} strokeWidth={2.5} /></span><span className="brand-name">meru<span>.</span><small>WORKSPACE</small></span></a>
      <div className="workspace-switch"><span className="workspace-avatar">M</span><span className="workspace-copy"><b>Meru Technosoft</b><small>Sales workspace</small></span><ChevronDown size={15} /></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="side-nav"><a className="nav-item active" href="#dashboard"><LayoutDashboard size={17} /> Dashboard</a><a className="nav-item" href="#leads"><Users size={17} /> Leads <span className="nav-count">{counts.Total}</span></a><a className="nav-item" href="#leads"><BriefcaseBusiness size={17} /> Companies</a></nav>
      <div className="nav-caption section-caption">PREFERENCES</div>
      <nav className="side-nav"><a className="nav-item" href="#settings"><Settings size={17} /> Settings</a><a className="nav-item" href="#help"><CircleHelp size={17} /> Help center</a></nav>
      <div className="sidebar-bottom"><div className="plan-card"><div className="plan-top"><span>FREE PLAN</span><span className="plan-percent">{Math.min(counts.Total, 100)}%</span></div><div className="plan-bar"><i style={{ width: `${Math.min(counts.Total, 100)}%` }} /></div><p><b>{counts.Total} of 100</b> leads used</p><button type="button" className="upgrade-btn" onClick={() => setToast('You are all set on the free plan')}>Explore plans <span>↗</span></button></div>
      <button className="profile-row" type="button" onClick={() => setToast('Profile settings coming soon')}><span className="profile-avatar">AM</span><span><b>Alex Morgan</b><small>Sales manager</small></span><MoreHorizontal size={17} /></button></div>
    </aside>
    <main className="main-content" id="top">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>Dashboard</strong></div><div className="top-actions"><span className="date-label">{TODAY_LABEL}</span><button className="top-avatar" title="Alex Morgan">AM</button></div></header>
      <div className="page-wrap">
        <section className="welcome-row" id="dashboard"><div><div className="eyebrow"><span className="live-dot" /> YOUR SALES OVERVIEW</div><h1>Good morning, Alex <span className="wave">✳</span></h1><p>Here’s what’s happening with your leads today.</p></div><div className="welcome-actions"><button className="button button-secondary" onClick={() => setToast('Export is coming soon')}><Download size={15} /> Export</button><button className="button button-primary" onClick={openCreate}><Plus size={17} /> Add a lead</button></div></section>
        {apiError && <div className="connection-banner"><span className="connection-dot" /><div><b>Can’t connect to your workspace data</b><span>{apiError}</span></div><button type="button" onClick={loadLeads}>Retry</button></div>}
        <section className="stats-grid" aria-label="Lead summary">{statCards.map(({ label, value, icon: Icon, tone, delta }) => <article className="stat-card" key={label}><div className="stat-heading"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={17} /></span></div><div className="stat-value">{value}<span className="stat-period">leads</span></div><div className="stat-foot"><span className="stat-spark">↗</span>{delta}</div></article>)}</section>
        <section className="pipeline-card"><div className="pipeline-copy"><div><span className="section-kicker">PIPELINE SNAPSHOT</span><h2>Lead distribution</h2><p>A quick look at where your prospects stand.</p></div><button className="quiet-button" onClick={() => { setSearch(''); setStatusFilter('') }}>View all leads <span>→</span></button></div>
          <div className="pipeline-track" aria-label="Lead distribution by status">{STATUSES.map((status) => { const value = counts[status]; const percent = counts.Total ? Math.max(value / counts.Total * 100, value ? 3 : 0) : 0; return <div key={status} className={`pipeline-segment ${status.toLowerCase()}`} style={{ width: `${percent}%` }} title={`${status}: ${value}`} /> })}</div>
          <div className="pipeline-legend">{STATUSES.map((status) => <button key={status} className="legend-item" onClick={() => setStatusFilter(statusFilter === status ? '' : status)}><i className={status.toLowerCase()} />{status}<b>{counts[status]}</b></button>)}</div>
        </section>
        <section className="leads-section" id="leads">
          <div className="leads-title-row"><div><div className="section-kicker">YOUR RELATIONSHIPS</div><h2>All leads <span className="total-pill">{counts.Total}</span></h2></div><button className="icon-button" title="Table options" onClick={() => setToast('All leads are shown newest first')}><SlidersHorizontal size={16} /></button></div>
          <div className="table-toolbar"><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, company or email..." aria-label="Search leads" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button>}<kbd>⌘ K</kbd></label><div className="toolbar-actions"><label className="filter-select"><ListFilter size={15} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={14} /></label><button className="button button-primary table-add" onClick={openCreate}><Plus size={16} /> Add lead</button></div></div>
          <div className="table-wrap"><table><thead><tr><th><input type="checkbox" aria-label="Select all leads" /></th><th>LEAD <ArrowDownUp size={12} /></th><th>COMPANY</th><th>SOURCE</th><th>STATUS</th><th>ADDED <ArrowDownUp size={12} /></th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
            {loading ? <tr><td colSpan="7" className="state-cell"><LoaderCircle className="spin" size={20} /> Loading leads...</td></tr> : leads.length === 0 ? <tr><td colSpan="7" className="empty-cell"><div className="empty-icon"><Users size={20} /></div><b>{search || statusFilter ? 'No leads match your filters' : 'Your pipeline starts here'}</b><span>{search || statusFilter ? 'Try a different search or status.' : 'Add your first lead to get the conversation started.'}</span>{!search && !statusFilter && <button className="button button-primary" onClick={openCreate}><Plus size={16} /> Add your first lead</button>}</td></tr> : leads.map((lead) => <tr key={lead._id}><td><input type="checkbox" aria-label={`Select ${lead.name}`} /></td><td><button className="lead-person" onClick={() => openEdit(lead)}><span className={`lead-avatar avatar-${(lead.name.charCodeAt(0) % 5) + 1}`}>{initials(lead.name)}</span><span><b>{lead.name}</b><small><Mail size={12} />{lead.email}</small></span></button></td><td><span className="company-cell"><span className="company-logo">{initials(lead.company)}</span><b>{lead.company}</b></span></td><td><span className="source-cell"><span className="source-dot" />{lead.source}</span></td><td><span className={`status-pill ${lead.status.toLowerCase()}`}><i />{lead.status}</span></td><td className="date-cell">{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td><td><div className="row-actions"><button title="Edit lead" onClick={() => openEdit(lead)}><Settings size={15} /></button><button title="Delete lead" onClick={() => deleteLead(lead)}><Trash2 size={15} /></button></div></td></tr>)}
          </tbody></table></div><div className="table-footer"><span>Showing <b>{leads.length}</b> of <b>{counts.Total}</b> leads</span><div><button disabled>← Previous</button><button disabled>Next →</button></div></div>
        </section>
        <footer className="page-footer"><span>© 2025 Meru Technosoft</span><span>Built for better conversations <span className="footer-heart">✦</span></span></footer>
      </div>
    </main>
    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false) }}><section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="section-kicker">{editingLead ? 'KEEP IT CURRENT' : 'GROW YOUR PIPELINE'}</span><h2 id="modal-title">{editingLead ? 'Edit lead' : 'Add a new lead'}</h2><p>{editingLead ? 'Update the details for this relationship.' : 'Capture a new prospect and keep the conversation moving.'}</p></div><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={18} /></button></div>
      <form onSubmit={saveLead}><div className="form-grid">
        <label className="form-field full"><span>Full name <i>*</i></span><input autoFocus required maxLength="100" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jordan Lee" /></label>
        <label className="form-field"><span>Email address <i>*</i></span><input type="email" required maxLength="254" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jordan@company.com" /></label>
        <label className="form-field"><span>Phone number <i>*</i></span><input type="tel" required maxLength="30" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" /></label>
        <label className="form-field"><span>Company <i>*</i></span><input required maxLength="120" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" /></label>
        <label className="form-field"><span>Lead source <i>*</i></span><span className="select-wrap"><select required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>{SOURCES.map((source) => <option key={source}>{source}</option>)}</select><ChevronDown size={15} /></span></label>
        <label className="form-field full"><span>Pipeline status</span><span className="select-wrap"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={15} /></span></label>
      </div>{formError && <div className="form-error">{formError}</div>}<div className="modal-footer"><span><i>*</i> Required fields</span><div><button type="button" className="button button-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}{saving ? 'Saving...' : editingLead ? 'Save changes' : 'Add lead'}</button></div></div></form>
    </section></div>}
    {toast && <div className="toast"><span><Check size={15} /></span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={14} /></button></div>}
  </div>
}

export default App
