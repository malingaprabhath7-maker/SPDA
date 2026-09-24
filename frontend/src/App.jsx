import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Database, Building2, MapPin, Briefcase, Users, PlusCircle, Search,
  FileDown, Printer, ChevronDown, ChevronRight, X, CheckCircle2, Layers, Sparkles, RefreshCw,
  BarChart3, PieChart as PieChartIcon, Pencil, Trash2, WifiOff
} from 'lucide-react';

// Backend base URL — set VITE_API_URL in your .env file, or change the fallback below
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/spda-backend';

const initialData = [
  {
    id: 1,
    name: "K. A. Nimal Perera",
    address: "No. 45, Galle Road, Hikkaduwa",
    nic: "851234567V",
    phone: "0771234567",
    whatsapp: "0771234567",
    email: "nimal.perera@gmail.com",
    district: "Galle",
    dsDivision: "Bope-Poddala",
    gnDivision: "Narawala 122",
    serviceCategory: "Export",
    natureOfBusiness: "Wood & Handicrafts",
    businessName: "Southern Teak Products",
    regNo: "SPDA/G/2021/104",
    employees: 12
  },
  {
    id: 2,
    name: "Sunil Shantha Silva",
    address: "No. 12/A, Matara Road, Weligama",
    nic: "902345678V",
    phone: "0712345678",
    whatsapp: "0712345678",
    email: "sunil.handicrafts@yahoo.com",
    district: "Matara",
    dsDivision: "Weligama",
    gnDivision: "Migigama 04",
    serviceCategory: "Certified Trainees",
    natureOfBusiness: "Coir & Handicrafts",
    businessName: "Ruhunu Crafts",
    regNo: "SPDA/M/2022/088",
    employees: 5
  },
  {
    id: 3,
    name: "W. M. Sugandhika Kumari",
    address: "Main Road, Ambalantota",
    nic: "199265401234",
    phone: "0783456789",
    whatsapp: "0783456789",
    email: "sugandhika.spda@gmail.com",
    district: "Hambantota",
    dsDivision: "Ambalantota",
    gnDivision: "Bolana 02",
    serviceCategory: "Self-employment",
    natureOfBusiness: "Food & Beverages",
    businessName: "Ruhunu Rasa Sweets",
    regNo: "SPDA/H/2023/312",
    employees: 3
  },
  {
    id: 4,
    name: "H. D. Manjula Prasanna",
    address: "102, Rathgama, Galle",
    nic: "781098765V",
    phone: "0754567890",
    whatsapp: "0754567890",
    email: "manjula.garments@outlook.com",
    district: "Galle",
    dsDivision: "Karandeniya",
    gnDivision: "Urugasmanhandiya",
    serviceCategory: "Small-scale",
    natureOfBusiness: "Apparel & Textiles",
    businessName: "Southern Apparel Industries",
    regNo: "SPDA/G/2020/015",
    employees: 28
  },
  {
    id: 5,
    name: "Priyantha Pushpakumara",
    address: "No. 88, Yakkalamulla Road, Galle",
    nic: "820987654V",
    phone: "0725678901",
    whatsapp: "0725678901",
    email: "priyantha.yakkala@gmail.com",
    district: "Galle",
    dsDivision: "Yakkalamulla",
    gnDivision: "Makandura 110",
    serviceCategory: "Self-employment",
    natureOfBusiness: "Agro-based Products",
    businessName: "Southern Spices Enterprises",
    regNo: "SPDA/G/2022/401",
    employees: 7
  },
  {
    id: 6,
    name: "Malini Abeysekara",
    address: "No. 14, Beach Road, Ambalangoda",
    nic: "886789012V",
    phone: "0766789012",
    whatsapp: "0766789012",
    email: "malini.masks@gmail.com",
    district: "Galle",
    dsDivision: "Ambalangoda",
    gnDivision: "Maha Ambalangoda",
    serviceCategory: "Export",
    natureOfBusiness: "Wood & Handicrafts",
    businessName: "Ruhunu Traditional Masks",
    regNo: "SPDA/G/2019/009",
    employees: 18
  },
  {
    id: 7,
    name: "R. M. Saman Rathnayake",
    address: "Tissa Road, Debarawewa, Tissamaharama",
    nic: "801239876V",
    phone: "0707890123",
    whatsapp: "0707890123",
    email: "saman.clay@gmail.com",
    district: "Hambantota",
    dsDivision: "Tissamaharama",
    gnDivision: "Debarawewa",
    serviceCategory: "Small-scale",
    natureOfBusiness: "Clay & Ceramics",
    businessName: "Ruhunu Clay Industries",
    regNo: "SPDA/H/2021/052",
    employees: 9
  }
];

const dsDivisionsByDistrict = {
  "Galle": ["Wadiramba", "Bope-Poddala", "Karandeniya", "Yakkalamulla", "Ambalangoda"],
  "Matara": ["Weligama", "Matara Town", "Deniyaya", "Thalpawila"],
  "Hambantota": ["Ambalantota", "Tissamaharama", "Tangalle", "Hambantota"]
};

const serviceCategories = ["Export", "Self-employment", "Small-scale", "Certified Trainees"];

const natureOfBusinesses = [
  "Wood & Handicrafts",
  "Food & Beverages",
  "Apparel & Textiles",
  "Agro-based Products",
  "Clay & Ceramics",
  "Metal & Machinery",
  "Health & Beauty",
  "IT & Services"
];

// Bilingual values stored as "<other language> / English" -> keep only the English part
const englishPart = (v) => {
  const s = (v ?? '').toString();
  return s.includes('/') ? s.split('/').pop().trim() : s.trim();
};

// Maps a record from the API (snake_case DB columns) or local sample data to one UI shape
const normalizeRecord = (r) => ({
  id: r.id ?? r.application_id,
  name: r.name ?? r.applicant_name ?? '',
  address: r.address ?? '',
  nic: r.nic ?? '',
  phone: r.phone ?? r.contact_number ?? '',
  whatsapp: r.whatsapp ?? r.whatsapp_number ?? '',
  email: r.email ?? '',
  district: englishPart(r.district ?? r.district_name),
  dsDivision: englishPart(r.dsDivision ?? r.dsd_name),
  gnDivision: r.gnDivision ?? r.gn_division ?? '',
  serviceCategory: englishPart(r.serviceCategory ?? r.service_division_name),
  natureOfBusiness: englishPart(r.natureOfBusiness ?? r.business_nature_name),
  businessName: r.businessName ?? r.business_name ?? '',
  regNo: r.regNo ?? r.registration_number ?? '',
  employees: r.employees ?? r.number_of_employees ?? ''
});

const emptyForm = {
  name: '', address: '', nic: '', phone: '', whatsapp: '', email: '',
  district: 'Galle', dsDivision: 'Bope-Poddala', gnDivision: '',
  serviceCategory: 'Self-employment', natureOfBusiness: 'Food & Beverages',
  businessName: '', regNo: '', employees: 1
};

// Keeps a stored value selectable in a dropdown even if it is not in the predefined list
const withCurrent = (list, value) => (value && !list.includes(value) ? [value, ...list] : list);

// Counts records per value, listing the predefined options first (including zero counts)
const countBy = (rows, key, options) => {
  const counts = Object.fromEntries(options.map(o => [o, 0]));
  rows.forEach(r => {
    const k = r[key] || 'Not specified';
    counts[k] = (counts[k] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

const escapeHtml = (v) =>
  String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Columns used for the printed / PDF table
const printColumns = [
  ['Name', r => r.name],
  ['Business Name', r => r.businessName],
  ['Reg. No', r => r.regNo],
  ['NIC', r => r.nic],
  ['District', r => r.district],
  ['DS Division', r => r.dsDivision],
  ['GN Division', r => r.gnDivision],
  ['Service Category', r => r.serviceCategory],
  ['Nature of Business', r => r.natureOfBusiness],
  ['Phone', r => r.phone],
  ['Employees', r => r.employees]
];

// Shared style tokens
const inputCls = "w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 focus:outline-none transition";
const labelCls = "block text-slate-700 font-semibold mb-1";
const navyBtn = "flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md transition";
const cardCls = "bg-white border border-slate-200 hover:border-[#1E3A8A]/40 rounded-2xl p-5 shadow-sm transition";

export default function App() {
  const [data, setData] = useState(() => initialData.map(normalizeRecord));
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filtering States
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedDs, setSelectedDs] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedNature, setSelectedNature] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion Expand States
  const [openAccordion, setOpenAccordion] = useState({
    district: true,
    ds: false,
    service: false,
    nature: false
  });

  // Modal State (editingId === null means "add new")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/applications/check.php`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      const rows = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : [];
      setData(rows.map(normalizeRecord));
      setServerOnline(true);
    } catch (error) {
      console.error("Fetch error:", error);
      setServerOnline(false);
      triggerToast("Unable to load data from the server. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleAccordion = (key) => {
    setOpenAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectFilter = (type, val) => {
    if (type === 'district') {
      setSelectedDistrict(val);
      setSelectedDs('All');
      setActiveTab('district');
    } else if (type === 'ds') {
      setSelectedDs(val);
      setActiveTab('ds');
    } else if (type === 'service') {
      setSelectedService(val);
      setActiveTab('service');
    } else if (type === 'nature') {
      setSelectedNature(val);
      setActiveTab('nature');
    }
  };

  const resetAllFilters = () => {
    setSelectedDistrict('All');
    setSelectedDs('All');
    setSelectedService('All');
    setSelectedNature('All');
    setSearchQuery('');
    setActiveTab('dashboard');
    triggerToast('All filters have been reset.');
  };

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return data.filter(item => {
      const matchDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
      const matchDs = selectedDs === 'All' || item.dsDivision === selectedDs;
      const matchService = selectedService === 'All' || item.serviceCategory === selectedService;
      const matchNature = selectedNature === 'All' || item.natureOfBusiness === selectedNature;
      const matchSearch = q === '' ||
        [item.name, item.businessName, item.nic, item.gnDivision, item.regNo]
          .some(v => (v || '').toString().toLowerCase().includes(q));

      return matchDistrict && matchDs && matchService && matchNature && matchSearch;
    });
  }, [data, selectedDistrict, selectedDs, selectedService, selectedNature, searchQuery]);

  const districtChartData = useMemo(() => {
    const counts = {};
    data.forEach(d => {
      const name = d.district || 'Not specified';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [data]);

  const serviceChartData = useMemo(() => {
    const counts = {};
    data.forEach(d => {
      const name = d.serviceCategory || 'Not specified';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [data]);

  // KPI figures (based on the currently filtered records)
  const stats = useMemo(() => {
    const distinct = (key) => new Set(filteredData.map(r => r[key]).filter(Boolean));
    return {
      districts: distinct('district'),
      services: distinct('serviceCategory'),
      industries: distinct('natureOfBusiness'),
      serviceBreakdown: countBy(filteredData, 'serviceCategory', serviceCategories),
      sectorBreakdown: countBy(filteredData, 'natureOfBusiness', natureOfBusinesses)
    };
  }, [filteredData]);

  // Navy / blue palette for charts
  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (row) => {
    setEditingId(row.id);
    setFormData({
      ...emptyForm,
      ...Object.fromEntries(Object.keys(emptyForm).map(k => [k, row[k] ?? emptyForm[k]])),
      employees: row.employees || 1
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEdit = editingId !== null;
    const payload = { ...formData, employees: parseInt(formData.employees) || 1 };

    // Server not reachable: apply the change to the on-screen sample data only
    if (!serverOnline) {
      setData(prev => isEdit
        ? prev.map(r => (r.id === editingId ? { ...r, ...payload } : r))
        : [{ ...payload, id: Date.now() }, ...prev]);
      closeModal();
      triggerToast(`Record ${isEdit ? 'updated' : 'added'} locally (server offline, not saved).`);
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/applications/${isEdit ? 'update' : 'create'}.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { ...payload, id: editingId } : payload)
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Save failed");
      }

      closeModal();
      triggerToast(isEdit ? "Record updated successfully." : "New entrepreneur saved successfully.");

      // Reload data from PostgreSQL
      await fetchData();
    } catch (error) {
      console.error("Save error:", error);
      triggerToast(`Unable to save data: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete the record of "${row.name}"?\nThis cannot be undone.`)) return;

    if (!serverOnline) {
      setData(prev => prev.filter(r => r.id !== row.id));
      triggerToast('Record removed locally (server offline, not saved).');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/applications/delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id })
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Delete failed");
      }

      triggerToast("Record deleted successfully.");
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      triggerToast(`Unable to delete record: ${error.message}`);
    }
  };

  // Prints only the filtered records as a plain table on A4 pages (no page chrome)
  const handlePrint = () => {
    if (filteredData.length === 0) {
      triggerToast('There are no records to print.');
      return;
    }

    const head = ['#', ...printColumns.map(([h]) => h)].map(h => `<th>${h}</th>`).join('');
    const body = filteredData.map((r, i) =>
      `<tr><td>${i + 1}</td>${printColumns.map(([, get]) => `<td>${escapeHtml(get(r))}</td>`).join('')}</tr>`
    ).join('');

    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>SPDA Entrepreneur Records</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #000; }
  table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  th, td { border: 1px solid #555; padding: 4px 5px; text-align: left; vertical-align: top; word-break: break-word; }
  th { background: #E5E7EB; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
</style></head>
<body><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`;

    let frame = document.getElementById('spda-print-frame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'spda-print-frame';
      frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
      document.body.appendChild(frame);
    }
    const doc = frame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    frame.contentWindow.focus();
    frame.contentWindow.print();
  };

  const handleExportPdf = () => {
    triggerToast('Choose "Save as PDF" as the printer to export.');
    handlePrint();
  };

  // Sidebar filter item style
  const filterItemCls = (active) =>
    `w-full text-left px-3 py-1.5 rounded-lg transition ${
      active
        ? 'bg-white text-[#0B1D3A] font-semibold shadow-sm'
        : 'text-blue-100/70 hover:text-white hover:bg-white/10'
    }`;

  const tooltipStyle = {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: '12px',
    color: '#0B1D3A',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
  };

  // Breakdown card (Service Categories / Business Sectors)
  const BreakdownCard = ({ title, icon: Icon, iconCls, barColor, rows }) => {
    const max = Math.max(1, ...rows.map(r => r.count));
    return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          <div className={`p-2.5 rounded-xl border ${iconCls}`}><Icon className="w-5 h-5" /></div>
        </div>
        <div className="space-y-2.5">
          {rows.map(r => (
            <div key={r.name} className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-700 font-medium">{r.name}</span>
                <span className="font-bold text-[#0B1D3A]">{r.count}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(r.count / max) * 100}%`, backgroundColor: barColor }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-[#1E3A8A] selection:text-white relative overflow-x-hidden">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0B1D3A] text-white px-5 py-3.5 rounded-xl shadow-2xl">
          <CheckCircle2 className="w-5 h-5 text-blue-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="flex flex-1 w-full min-h-screen">

        {/* ===== Sidebar ===== */}
        <aside className="w-80 bg-[#0B1D3A] text-white flex flex-col justify-between shrink-0 z-20">

          <div>
            {/* SPDA Branding & Official Logo */}
            <div className="p-5 border-b border-white/10 flex items-center gap-3.5">
              <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow">
                <img
                  src="/download.jpg"
                  alt="SPDA Official Logo"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight tracking-wide text-white flex items-center gap-1.5">
                  SPDA <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-blue-100 border border-white/20">ADMIN</span>
                </h1>
                <p className="text-[11px] text-blue-100/70 font-medium leading-none mt-1">
                  Southern Province Development Authority
                </p>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-1 text-sm font-medium overflow-y-auto max-h-[calc(100vh-160px)]">

              <button
                onClick={() => { setActiveTab('dashboard'); setSelectedDistrict('All'); setSelectedDs('All'); setSelectedService('All'); setSelectedNature('All'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-[#0B1D3A] shadow-md'
                    : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-white text-[#0B1D3A] shadow-md'
                    : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4" />
                  <span>All Data</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${activeTab === 'overview' ? 'bg-[#1E3A8A] text-white' : 'bg-white/10 text-blue-100'}`}>
                  {data.length}
                </span>
              </button>

              <div className="pt-3 pb-1">
                <p className="text-[10px] font-semibold tracking-wider text-blue-200/60 uppercase px-3">
                  Filters
                </p>
              </div>

              {/* Accordion 1: District */}
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('district')}
                  className="w-full flex items-center justify-between p-3 text-blue-50 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <MapPin className="w-4 h-4 text-blue-300" />
                    <span>District</span>
                  </div>
                  {openAccordion.district ? <ChevronDown className="w-3.5 h-3.5 text-blue-200" /> : <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </button>
                {openAccordion.district && (
                  <div className="p-2 space-y-1 border-t border-white/10 text-xs">
                    <button onClick={() => handleSelectFilter('district', 'All')} className={filterItemCls(selectedDistrict === 'All')}>
                      All Districts
                    </button>
                    {Object.keys(dsDivisionsByDistrict).map(dist => (
                      <button key={dist} onClick={() => handleSelectFilter('district', dist)} className={filterItemCls(selectedDistrict === dist)}>
                        {dist}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 2: DS Division */}
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('ds')}
                  className="w-full flex items-center justify-between p-3 text-blue-50 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <Building2 className="w-4 h-4 text-blue-300" />
                    <span>DS Division</span>
                  </div>
                  {openAccordion.ds ? <ChevronDown className="w-3.5 h-3.5 text-blue-200" /> : <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </button>
                {openAccordion.ds && (
                  <div className="p-2 space-y-1 border-t border-white/10 text-xs max-h-40 overflow-y-auto">
                    <button onClick={() => handleSelectFilter('ds', 'All')} className={filterItemCls(selectedDs === 'All')}>
                      All DS Divisions
                    </button>
                    {(selectedDistrict !== 'All' ? dsDivisionsByDistrict[selectedDistrict] || [] : Object.values(dsDivisionsByDistrict).flat()).map(ds => (
                      <button key={ds} onClick={() => handleSelectFilter('ds', ds)} className={filterItemCls(selectedDs === ds)}>
                        {ds}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 3: Service Category */}
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('service')}
                  className="w-full flex items-center justify-between p-3 text-blue-50 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <Briefcase className="w-4 h-4 text-blue-300" />
                    <span>Service Category</span>
                  </div>
                  {openAccordion.service ? <ChevronDown className="w-3.5 h-3.5 text-blue-200" /> : <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </button>
                {openAccordion.service && (
                  <div className="p-2 space-y-1 border-t border-white/10 text-xs">
                    <button onClick={() => handleSelectFilter('service', 'All')} className={filterItemCls(selectedService === 'All')}>
                      All Services
                    </button>
                    {serviceCategories.map(cat => (
                      <button key={cat} onClick={() => handleSelectFilter('service', cat)} className={filterItemCls(selectedService === cat)}>
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 4: Nature of Business */}
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('nature')}
                  className="w-full flex items-center justify-between p-3 text-blue-50 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <Layers className="w-4 h-4 text-blue-300" />
                    <span>Nature of Business</span>
                  </div>
                  {openAccordion.nature ? <ChevronDown className="w-3.5 h-3.5 text-blue-200" /> : <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </button>
                {openAccordion.nature && (
                  <div className="p-2 space-y-1 border-t border-white/10 text-xs max-h-40 overflow-y-auto">
                    <button onClick={() => handleSelectFilter('nature', 'All')} className={filterItemCls(selectedNature === 'All')}>
                      All Business Types
                    </button>
                    {natureOfBusinesses.map(nat => (
                      <button key={nat} onClick={() => handleSelectFilter('nature', nat)} className={filterItemCls(selectedNature === nat)}>
                        {nat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </nav>
          </div>

          {/* Reset Filters / Footer */}
          <div className="p-4 border-t border-white/10 space-y-3">
            <button
              onClick={resetAllFilters}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <div className="text-center text-[10px] text-blue-200/60">
              © 2026 Southern Province Development Authority
            </div>
          </div>

        </aside>

        {/* ===== Main Content ===== */}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-white">

          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">

            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span>SPDA Admin</span>
              <span>/</span>
              <span className="text-[#0B1D3A] font-semibold">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'overview' && 'All Entrepreneur Records'}
                {activeTab === 'district' && `District View (${selectedDistrict})`}
                {activeTab === 'ds' && `DS Division View (${selectedDs})`}
                {activeTab === 'service' && `Service Category View (${selectedService})`}
                {activeTab === 'nature' && `Nature of Business View (${selectedNature})`}
              </span>
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1E3A8A]" />}
              {!loading && !serverOnline && (
                <span className="ml-2 flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <WifiOff className="w-3 h-3" /> Server offline: sample data
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={openAddModal} className={navyBtn}>
                <PlusCircle className="w-4 h-4" />
                <span>Add New Entrepreneur</span>
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                <div className="w-7 h-7 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-800 leading-tight">Admin User</div>
                  <div className="text-[10px] text-slate-500 leading-none">SPDA HQ Galle</div>
                </div>
              </div>
            </div>
          </header>

          {/* Workspace */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className={`relative overflow-hidden ${cardCls}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <img src="/download.jpg" className="w-20 h-20 object-contain" alt="" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Entrepreneurs</span>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600"><Users className="w-5 h-5" /></div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-[#0B1D3A]">{filteredData.length}</span>
                  <span className="text-xs text-slate-500">of {data.length} total</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Active SPDA Database</span>
                </div>
              </div>

              <div className={cardCls}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Districts Covered</span>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600"><MapPin className="w-5 h-5" /></div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-[#0B1D3A]">{stats.districts.size}</span>
                  <span className="text-xs text-slate-500">of {Object.keys(dsDivisionsByDistrict).length} districts</span>
                </div>
                <div className="mt-2 text-xs text-slate-500 truncate">
                  {[...stats.districts].join(' | ') || 'No districts'}
                </div>
              </div>

              <div className={cardCls}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Services</span>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-600"><Briefcase className="w-5 h-5" /></div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-[#0B1D3A]">{stats.services.size}</span>
                  <span className="text-xs text-slate-500">of {serviceCategories.length} services</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">Services with registered entrepreneurs</div>
              </div>

              <div className={cardCls}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Industries</span>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-600"><Building2 className="w-5 h-5" /></div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-[#0B1D3A]">{stats.industries.size}</span>
                  <span className="text-xs text-slate-500">of {natureOfBusinesses.length} industry types</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">Industries with registered entrepreneurs</div>
              </div>

            </div>

            {/* Service Categories & Business Sectors Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BreakdownCard
                title="Service Categories"
                icon={Briefcase}
                iconCls="bg-purple-50 border-purple-100 text-purple-600"
                barColor="#8B5CF6"
                rows={stats.serviceBreakdown}
              />
              <BreakdownCard
                title="Business Sectors"
                icon={Layers}
                iconCls="bg-amber-50 border-amber-100 text-amber-600"
                barColor="#F59E0B"
                rows={stats.sectorBreakdown}
              />
            </div>

            {/* Charts */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 pt-5">
                    <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#1E3A8A]" />
                      Entrepreneurs by District
                    </h2>
                  </div>
                  <div className="h-64 w-full p-5">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={districtChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#EFF6FF' }} />
                        <Bar dataKey="count" name="Entrepreneurs" radius={[6, 6, 0, 0]}>
                          {districtChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 pt-5">
                    <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <PieChartIcon className="w-4 h-4 text-[#1E3A8A]" />
                      Service Category Distribution
                    </h2>
                  </div>
                  <div className="h-64 w-full p-5 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {serviceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* Search & Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">

                <div className="relative flex-1 min-w-[280px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, business name, NIC, GN division or reg. no..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#1E3A8A] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handlePrint} className={navyBtn}>
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  <button onClick={handleExportPdf} className={navyBtn}>
                    <FileDown className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                </div>

              </div>

              {/* Active Filter Chips */}
              {(selectedDistrict !== 'All' || selectedDs !== 'All' || selectedService !== 'All' || selectedNature !== 'All') && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs flex-wrap">
                  <span className="text-slate-500 font-semibold">Active filters:</span>
                  {[
                    [selectedDistrict, setSelectedDistrict],
                    [selectedDs, setSelectedDs],
                    [selectedService, setSelectedService],
                    [selectedNature, setSelectedNature]
                  ].filter(([val]) => val !== 'All').map(([val, setter]) => (
                    <span key={val} className="bg-blue-50 border border-blue-200 text-[#1E3A8A] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      {val}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setter('All')} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#0B1D3A] flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#1E3A8A]" />
                  Entrepreneur Database Records
                </h3>
                <span className="text-xs text-slate-500">
                  Showing records: <strong className="text-[#1E3A8A]">{filteredData.length}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 whitespace-nowrap">Name</th>
                      <th className="p-3.5 whitespace-nowrap">Business Name</th>
                      <th className="p-3.5 whitespace-nowrap">Reg. No</th>
                      <th className="p-3.5 whitespace-nowrap">NIC</th>
                      <th className="p-3.5 whitespace-nowrap">District</th>
                      <th className="p-3.5 whitespace-nowrap">DS Division</th>
                      <th className="p-3.5 whitespace-nowrap">GN Division</th>
                      <th className="p-3.5 whitespace-nowrap">Service Category</th>
                      <th className="p-3.5 whitespace-nowrap">Nature of Business</th>
                      <th className="p-3.5 whitespace-nowrap">Phone / WhatsApp</th>
                      <th className="p-3.5 whitespace-nowrap">Employees</th>
                      <th className="p-3.5 whitespace-nowrap text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredData.length > 0 ? (
                      filteredData.map((row, i) => (
                        <tr key={row.id} className={`hover:bg-blue-50 transition duration-150 ${i % 2 ? 'bg-slate-50/60' : 'bg-white'}`}>
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{row.name}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{row.address}</div>
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-medium text-[#1E3A8A]">
                            {row.businessName || '-'}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {row.regNo ? (
                              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
                                {row.regNo}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-mono text-slate-600">{row.nic}</td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 text-[11px] font-medium">
                              {row.district}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap">{row.dsDivision}</td>
                          <td className="p-3.5 whitespace-nowrap text-slate-600">{row.gnDivision}</td>
                          <td className="p-3.5 whitespace-nowrap">
                            {row.serviceCategory ? (
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                                {row.serviceCategory}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">{row.natureOfBusiness || '-'}</td>
                          <td className="p-3.5 whitespace-nowrap text-slate-600">
                            <div>{row.phone}</div>
                            {row.whatsapp && <div className="text-[10px] text-emerald-600">WA: {row.whatsapp}</div>}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-center font-bold text-slate-900">{row.employees || '-'}</td>
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditModal(row)}
                                title="Edit record"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1E3A8A] font-semibold transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(row)}
                                title="Delete record"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="p-8 text-center text-slate-500">
                          <p className="text-sm">No records found.</p>
                          <p className="text-xs mt-1">Please check your filters and try again.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* ===== Add / Edit Entrepreneur Modal ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="p-5 bg-[#0B1D3A] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl">
                  {editingId !== null ? <Pencil className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold">{editingId !== null ? 'Edit Entrepreneur' : 'Add New Entrepreneur'}</h3>
                  <p className="text-xs text-blue-100/80">
                    {editingId !== null ? 'Update this record in the SPDA database' : 'Add a new record to the SPDA database'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-blue-100 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. K. A. Nimal Perera" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>NIC Number *</label>
                  <input type="text" required value={formData.nic}
                    onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                    placeholder="e.g. 851234567V" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Address *</label>
                <input type="text" required value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Business or personal address" className={inputCls} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Phone Number *</label>
                  <input type="text" required value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0771234567" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>WhatsApp Number</label>
                  <input type="text" value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="0771234567" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@gmail.com" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-3">
                <div>
                  <label className={labelCls}>District *</label>
                  <select value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value, dsDivision: (dsDivisionsByDistrict[e.target.value] || [''])[0] })}
                    className={inputCls}>
                    {withCurrent(Object.keys(dsDivisionsByDistrict), formData.district).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>DS Division *</label>
                  <select value={formData.dsDivision}
                    onChange={(e) => setFormData({ ...formData, dsDivision: e.target.value })}
                    className={inputCls}>
                    {withCurrent(dsDivisionsByDistrict[formData.district] || [], formData.dsDivision).map(ds => (
                      <option key={ds} value={ds}>{ds}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>GN Division *</label>
                  <input type="text" required value={formData.gnDivision}
                    onChange={(e) => setFormData({ ...formData, gnDivision: e.target.value })}
                    placeholder="e.g. Narawala 122" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-3">
                <div>
                  <label className={labelCls}>Business Name *</label>
                  <input type="text" required value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Ruhunu Products" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Registration Number *</label>
                  <input type="text" required value={formData.regNo}
                    onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                    placeholder="SPDA/G/2026/001" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Service Category *</label>
                  <select value={formData.serviceCategory}
                    onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                    className={inputCls}>
                    {withCurrent(serviceCategories, formData.serviceCategory).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Nature of Business *</label>
                  <select value={formData.natureOfBusiness}
                    onChange={(e) => setFormData({ ...formData, natureOfBusiness: e.target.value })}
                    className={inputCls}>
                    {withCurrent(natureOfBusinesses, formData.natureOfBusiness).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Number of Employees *</label>
                  <input type="number" min="1" required value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                    className={inputCls} />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-60 text-white font-semibold shadow-md transition"
                >
                  {saving ? 'Saving...' : editingId !== null ? 'Update Record' : 'Save Record'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}