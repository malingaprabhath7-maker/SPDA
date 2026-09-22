import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart 
} from 'recharts';
import { 
  LayoutDashboard, Database, Building2, MapPin, Briefcase, Users, PlusCircle, Search, 
  FileDown, Printer, Filter, ChevronDown, ChevronRight, X, User, Phone, Mail, FileText, 
  CheckCircle2, ArrowUpRight, Shield, Layers, Globe, Sparkles, RefreshCw
} from 'lucide-react';

const initialData = [
  {
    id: 1,
    name: "කේ. ඒ. නිමල් පෙරේරා",
    address: "නො. 45, ගාලු පාර, හික්කඩුව",
    nic: "851234567V",
    phone: "0771234567",
    whatsapp: "0771234567",
    email: "nimal.perera@gmail.com",
    district: "ගාල්ල / Galle",
    dsDivision: "බෝපෙ-පෝද්දල",
    gnDivision: "නාරාවල 122",
    serviceCategory: "Export",
    natureOfBusiness: "ලී භාණ්ඩ හා අත්කම්",
    businessName: "දකුණු තේක්ක නිෂ්පාදන",
    regNo: "SPDA/G/2021/104",
    employees: 12
  },
  {
    id: 2,
    name: "සුනිල් ශාන්ත සිල්වා",
    address: "නො. 12/A, මාතර පාර, වැලිගම",
    nic: "902345678V",
    phone: "0712345678",
    whatsapp: "0712345678",
    email: "sunil.handicrafts@yahoo.com",
    district: "මාතර / Matara",
    dsDivision: "වලිගම",
    gnDivision: "මිගිගම 04",
    serviceCategory: "Certified Trainees",
    natureOfBusiness: "රැහැන් හා අත්කම්",
    businessName: "රුහුණු හැඩවැඩ",
    regNo: "SPDA/M/2022/088",
    employees: 5
  },
  {
    id: 3,
    name: "ඩබ්. එම්. සුගන්ධිකා කුමාරි",
    address: "ප්‍රධාන පාර, අම්බලන්තොට",
    nic: "199265401234",
    phone: "0783456789",
    whatsapp: "0783456789",
    email: "sugandhika.spda@gmail.com",
    district: "හම්බන්තොට / Hambantota",
    dsDivision: "අම්බලන්තොට",
    gnDivision: "බෝලන 02",
    serviceCategory: "Self-employment",
    natureOfBusiness: "ආහාර හා පාන",
    businessName: "රුහුණු රස රසකැවිලි",
    regNo: "SPDA/H/2023/312",
    employees: 3
  },
  {
    id: 4,
    name: "එච්. ඩී. මංජුල ප්‍රසන්න",
    address: "102, රත්ගම, ගාල්ල",
    nic: "781098765V",
    phone: "0754567890",
    whatsapp: "0754567890",
    email: "manjula.garments@outlook.com",
    district: "ගාල්ල / Galle",
    dsDivision: "කරන්දෙනිය",
    gnDivision: "උරගස්මන්හන්දිය",
    serviceCategory: "Small-scale",
    natureOfBusiness: "ඇඟලුම් හා රෙදිපිළි",
    businessName: "දකුණු ඇඟලුම් කර්මාන්ත",
    regNo: "SPDA/G/2020/015",
    employees: 28
  },
  {
    id: 5,
    name: "ප්‍රියන්ත පුෂ්පකුමාර",
    address: "නො. 88, යක්කලමුල්ල පාර, ගාලු",
    nic: "820987654V",
    phone: "0725678901",
    whatsapp: "0725678901",
    email: "priyantha.yakkala@gmail.com",
    district: "ගාල්ල / Galle",
    dsDivision: "යක්කලමුල්ල",
    gnDivision: "මාකඳුර 110",
    serviceCategory: "Self-employment",
    natureOfBusiness: "කෘෂි පාදක නිෂ්පාදන",
    businessName: "දකුණු කුළුබඩු එන්ටප්‍රයිසස්",
    regNo: "SPDA/G/2022/401",
    employees: 7
  },
  {
    id: 6,
    name: "මාලිනී අබේසේකර",
    address: "නො. 14, වෙරළ පාර, අම්බලන්ගොඩ",
    nic: "886789012V",
    phone: "0766789012",
    whatsapp: "0766789012",
    email: "malini.masks@gmail.com",
    district: "ගාල්ල / Galle",
    dsDivision: "අම්බලන්ගොඩ",
    gnDivision: "මහා අම්බලන්ගොඩ",
    serviceCategory: "Export",
    natureOfBusiness: "ලී භාණ්ඩ හා අත්කම්",
    businessName: "රුහුණු සාම්ප්‍රදායික වෙස්මුහුණු",
    regNo: "SPDA/G/2019/009",
    employees: 18
  },
  {
    id: 7,
    name: "ආර්. එම්. සමන් රත්නායක",
    address: "තිස්ස පාර, දෙබරවැව, තිස්සමහාරාමය",
    nic: "801239876V",
    phone: "0707890123",
    whatsapp: "0707890123",
    email: "saman.clay@gmail.com",
    district: "හම්බන්තොට / Hambantota",
    dsDivision: "තිස්සමහාරාමය",
    gnDivision: "දෙබරවැව",
    serviceCategory: "Small-scale",
    natureOfBusiness: "මැටි හා සෙරමික්",
    businessName: "රුහුණු මැටි කර්මාන්ත",
    regNo: "SPDA/H/2021/052",
    employees: 9
  }
];

const dsDivisionsByDistrict = {
  "ගාල්ල / Galle": ["වදිරම්බ", "බෝපෙ-පෝද්දල", "කරන්දෙනිය", "යක්කලමුල්ල", "අම්බලන්ගොඩ"],
  "මාතර / Matara": ["වැලගම", "මාතර නගරය", "දෙනියාය", "තල්පාවිල"],
  "හම්බන්තොට / Hambantota": ["අම්බලන්තොට", "තිස්සමහාරාමය", "තංගල්ල", "හම්බන්තොට"]
};

const serviceCategories = ["Export", "Self-employment", "Small-scale", "Certified Trainees"];

const natureOfBusinesses = [
  "ලී භාණ්ඩ හා අත්කම්",
  "ආහාර හා පාන",
  "ඇඟලුම් හා රෙදිපිළි",
  "කෘෂි පාදක නිෂ්පාදන",
  "මැටි හා සෙරමික්",
  "ලෝහ හා යන්ත්‍රෝපකරණ",
  "සෞඛ්‍ය හා අලංකරණ",
  "තොරතුරු තාක්ෂණ හා සේවා"
];

export default function App() {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'overview', 'district', 'ds', 'service', 'nature'
  
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', address: '', nic: '', phone: '', whatsapp: '', email: '',
    district: 'ගාල්ල / Galle', dsDivision: 'බෝපෙ-පෝද්දල', gnDivision: '',
    serviceCategory: 'Self-employment', natureOfBusiness: 'ආහාර හා පාන',
    businessName: '', regNo: '', employees: 1
  });
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/applications/check.php`);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();

    if (Array.isArray(result)) {
      setData(result);
    } else if (result.data && Array.isArray(result.data)) {
      setData(result.data);
    } else {
      setData([]);
    }

  } catch (error) {
    console.error("Fetch error:", error);
    triggerToast("දත්ත ලබාගැනීමට නොහැකි විය.");
  } finally {
    setLoading(false);
  }
};
  // Notification Banner
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

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
    triggerToast('සියලු පෙළගැස්වීම් යළි මුල් තත්වයට පත් කරන ලදී');
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
      const matchDs = selectedDs === 'All' || item.dsDivision === selectedDs;
      const matchService = selectedService === 'All' || item.serviceCategory === selectedService;
      const matchNature = selectedNature === 'All' || item.natureOfBusiness === selectedNature;
      const matchSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.gnDivision.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.regNo.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDistrict && matchDs && matchService && matchNature && matchSearch;
    });
  }, [data, selectedDistrict, selectedDs, selectedService, selectedNature, searchQuery]);

  const districtChartData = useMemo(() => {
    const counts = {};
    data.forEach(d => {
      const name = d.district.split('/')[0].trim();
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [data]);

  const serviceChartData = useMemo(() => {
    const counts = {};
    data.forEach(d => {
      counts[d.serviceCategory] = (counts[d.serviceCategory] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [data]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

  const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${API_URL}/applications/create.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        employees: parseInt(formData.employees) || 1
      })
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Save failed");
    }

    setIsModalOpen(false);

    triggerToast("නව ව්‍යවසායකයා සාර්ථකව සුරකින ලදී.");

    resetForm();

    // PostgreSQL එකෙන් නැවත data ගන්න
    await fetchData();

  } catch (error) {
    console.error("Save error:", error);
    triggerToast(`දත්ත සුරැකීමට නොහැකි විය: ${error.message}`);
  }
};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Glowing Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/90 border border-cyan-500/50 text-cyan-200 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="flex flex-1 w-full min-h-screen">

        {}
        <aside className="w-80 bg-slate-900/60 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between shrink-0 z-20 print:hidden">
          
          <div>
            {/* SPDA Branding & Official Logo */}
            <div className="p-5 border-b border-slate-800/80 flex items-center gap-3.5 bg-slate-950/40">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-slate-950 p-2 rounded-xl border border-slate-700/60 flex items-center justify-center">
                  <img 
                    src="https://i.ibb.co/3W4T5Qn/SPDA-Logo-Color.png" 
                    alt="SPDA Official Logo" 
                    className="w-10 h-10 object-contain drop-shadow"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src="https://via.placeholder.com/40?text=SPDA";
                    }}
                  />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight tracking-wide text-white flex items-center gap-1.5">
                  SPDA <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">ADMIN</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                  දකුණු පළාත් සංවර්ධන අධිකාරිය
                </p>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-1 text-sm font-medium overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
              
              {/* Primary Tabs */}
              <button
                onClick={() => { setActiveTab('dashboard'); setSelectedDistrict('All'); setSelectedDs('All'); setSelectedService('All'); setSelectedNature('All'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>ප්‍රධාන පුවරුව (Dashboard)</span>
              </button>

              <button
                onClick={() => { setActiveTab('overview'); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-slate-800/90 text-white border border-slate-700/80 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>සියලු දත්ත (All Data)</span>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-md border border-slate-700">
                  {data.length}
                </span>
              </button>

              <div className="pt-3 pb-1">
                <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-3">
                  විස්තාරිත පෙළගැස්වීම් (Filters)
                </p>
              </div>

              {/* Accordion 1: District View */}
              <div className="rounded-xl border border-slate-800/60 bg-slate-950/20 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('district')}
                  className="w-full flex items-center justify-between p-3 text-slate-300 hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>දිස්ත්‍රික්කය (District)</span>
                  </div>
                  {openAccordion.district ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openAccordion.district && (
                  <div className="p-2 space-y-1 bg-slate-900/40 border-t border-slate-800/40 text-xs">
                    <button
                      onClick={() => handleSelectFilter('district', 'All')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition ${selectedDistrict === 'All' ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      සියලු දිස්ත්‍රික්ක (All Districts)
                    </button>
                    {Object.keys(dsDivisionsByDistrict).map(dist => (
                      <button
                        key={dist}
                        onClick={() => handleSelectFilter('district', dist)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg transition ${selectedDistrict === dist ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {dist}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 2: DS Division View */}
              <div className="rounded-xl border border-slate-800/60 bg-slate-950/20 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('ds')}
                  className="w-full flex items-center justify-between p-3 text-slate-300 hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>ප්‍රා.ලේ. කොට්ඨාසය (DS Div)</span>
                  </div>
                  {openAccordion.ds ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openAccordion.ds && (
                  <div className="p-2 space-y-1 bg-slate-900/40 border-t border-slate-800/40 text-xs max-h-40 overflow-y-auto">
                    <button
                      onClick={() => handleSelectFilter('ds', 'All')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition ${selectedDs === 'All' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      සියල්ල (All DS Divisions)
                    </button>
                    {(selectedDistrict !== 'All' ? dsDivisionsByDistrict[selectedDistrict] || [] : Object.values(dsDivisionsByDistrict).flat()).map(ds => (
                      <button
                        key={ds}
                        onClick={() => handleSelectFilter('ds', ds)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg transition ${selectedDs === ds ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {ds}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 3: Service Category */}
              <div className="rounded-xl border border-slate-800/60 bg-slate-950/20 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('service')}
                  className="w-full flex items-center justify-between p-3 text-slate-300 hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <Briefcase className="w-4 h-4 text-sky-400" />
                    <span>සේවා කාණ්ඩය (Service)</span>
                  </div>
                  {openAccordion.service ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openAccordion.service && (
                  <div className="p-2 space-y-1 bg-slate-900/40 border-t border-slate-800/40 text-xs">
                    <button
                      onClick={() => handleSelectFilter('service', 'All')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition ${selectedService === 'All' ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      සියල්ල (All Services)
                    </button>
                    {serviceCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleSelectFilter('service', cat)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg transition ${selectedService === cat ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 4: Nature of Business */}
              <div className="rounded-xl border border-slate-800/60 bg-slate-950/20 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('nature')}
                  className="w-full flex items-center justify-between p-3 text-slate-300 hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <Layers className="w-4 h-4 text-pink-400" />
                    <span>ව්‍යාපාරයේ ස්වභාවය (Nature)</span>
                  </div>
                  {openAccordion.nature ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openAccordion.nature && (
                  <div className="p-2 space-y-1 bg-slate-900/40 border-t border-slate-800/40 text-xs max-h-40 overflow-y-auto">
                    <button
                      onClick={() => handleSelectFilter('nature', 'All')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition ${selectedNature === 'All' ? 'bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      සියලුම ව්‍යාපාර ස්වභාවයන්
                    </button>
                    {natureOfBusinesses.map(nat => (
                      <button
                        key={nat}
                        onClick={() => handleSelectFilter('nature', nat)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg transition ${selectedNature === nat ? 'bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {nat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </nav>
          </div>

          {/* Quick Clear Filter / System Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-3">
            <button
              onClick={resetAllFilters}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 text-xs font-medium transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>පෙළගැස්වීම් නැවත සකසන්න</span>
            </button>

            <div className="text-center text-[10px] text-slate-500">
              © 2026 Southern Province Dev Authority
            </div>
          </div>

        </aside>

        {}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          
          {/* Top Header Glass Bar */}
          <header className="h-16 bg-slate-900/40 border-b border-slate-800/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 print:hidden">
            
            {/* Breadcrumb Info */}
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
              <span className="text-slate-500">SPDA Admin</span>
              <span>/</span>
              <span className="text-white font-semibold flex items-center gap-2">
                {activeTab === 'dashboard' && 'ප්‍රධාන සංඛ්‍යාත්මක පුවරුව (Dashboard Overview)'}
                {activeTab === 'overview' && 'සම්පූර්ණ දත්ත ලැයිස්තුව (All Entrepreneur Database)'}
                {activeTab === 'district' && `දිස්ත්‍රික් දර්ශනය (${selectedDistrict})`}
                {activeTab === 'ds' && `ප්‍රා.ලේ. කොට්ඨාස දර්ශනය (${selectedDs})`}
                {activeTab === 'service' && `සේවා කාණ්ඩ දර්ශනය (${selectedService})`}
                {activeTab === 'nature' && `ව්‍යාපාර ස්වභාව දර්ශනය (${selectedNature})`}
              </span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>නව ව්‍යවසායකයෙකු ඇතුළත් කරන්න</span>
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-full px-3 py-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-200 leading-tight">Admin User</div>
                  <div className="text-[10px] text-slate-400 leading-none">SPDA HQ Galle</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Dashboard Workspace */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* KPI 1: Total Records with Official SPDA Logo Badge */}
              <div className="relative group bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-5 backdrop-blur-xl transition duration-300 overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <img src="https://i.ibb.co/3W4T5Qn/SPDA-Logo-Color.png" className="w-20 h-20 object-contain" alt="SPDA Logo Watermark" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ලියාපදිංචි ව්‍යවසායකයින්</span>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{filteredData.length}</span>
                  <span className="text-xs text-slate-400">/ මුළු {data.length} කින්</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>සක්‍රීය SPDA දත්ත පද්ධතිය</span>
                </div>
              </div>

              {/* KPI 2: Districts Covered */}
              <div className="bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-5 backdrop-blur-xl transition duration-300 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">අවරණය වන දිස්ත්‍රික්ක</span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white tracking-tight">3</span>
                  <span className="text-xs text-slate-400">ගාලු | මාතර | හම්බන්තොට</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  දකුණු පළාත් පූර්ණ ආවරණය
                </div>
              </div>

              {/* KPI 3: Service Categories */}
              <div className="bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-5 backdrop-blur-xl transition duration-300 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">සේවා කාණ්ඩ</span>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{serviceCategories.length}</span>
                  <span className="text-xs text-slate-400">ක්‍රියාකාරී සේවා</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Export, Self-employment...
                </div>
              </div>

              {/* KPI 4: Active Businesses */}
              <div className="bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/50 rounded-2xl p-5 backdrop-blur-xl transition duration-300 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ව්‍යාපාර ක්ෂේත්‍ර</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{natureOfBusinesses.length}</span>
                  <span className="text-xs text-slate-400">කර්මාන්ත වර්ග</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  ලී, අත්කම්, ආහාර, ඇඟලුම්...
                </div>
              </div>

            </div>

            {}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: District Distribution */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <BarChart className="w-4 h-4 text-cyan-400" />
                      දිස්ත්‍රික්ක අනුව ව්‍යවසායකයින් සංඛ්‍යාව
                    </h2>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={districtChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        />
                        <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                          {districtChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Service Distribution */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-purple-400" />
                      සේවා කාණ්ඩ ප්‍රතිශතය
                    </h2>
                  </div>
                  <div className="h-64 w-full flex items-center justify-center">
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
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-xl space-y-3 print:hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                
                {/* Global Live Search Input */}
                <div className="relative flex-1 min-w-[280px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="නම, ව්‍යාපාර නම, ජා.හැ. අංකය හෝ ග්‍රාම නිලධාරී වසම සොයන්න..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Print & PDF Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    <Printer className="w-4 h-4 text-cyan-400" />
                    <span>මුද්‍රණය (Print)</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400" />
                    <span>PDF ලබාගන්න</span>
                  </button>
                </div>

              </div>

              {/* Active Filter Chips */}
              {(selectedDistrict !== 'All' || selectedDs !== 'All' || selectedService !== 'All' || selectedNature !== 'All') && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs flex-wrap">
                  <span className="text-slate-500 font-semibold">සක්‍රීය පෙළගැස්වීම්:</span>
                  {selectedDistrict !== 'All' && (
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      {selectedDistrict}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDistrict('All')} />
                    </span>
                  )}
                  {selectedDs !== 'All' && (
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      {selectedDs}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDs('All')} />
                    </span>
                  )}
                  {selectedService !== 'All' && (
                    <span className="bg-sky-500/10 border border-sky-500/30 text-sky-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      {selectedService}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedService('All')} />
                    </span>
                  )}
                  {selectedNature !== 'All' && (
                    <span className="bg-pink-500/10 border border-pink-500/30 text-pink-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      {selectedNature}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedNature('All')} />
                    </span>
                  )}
                </div>
              )}
            </div>

            {}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden">
              
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  ව්‍යවසායක දත්ත සමුදාය (Database Records)
                </h3>
                <span className="text-xs text-slate-400">
                  පෙන්වන වාර්තා සංඛ්‍යාව: <strong className="text-cyan-400">{filteredData.length}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 whitespace-nowrap">නම (Name)</th>
                      <th className="p-3.5 whitespace-nowrap">ව්‍යාපාරයේ නම</th>
                      <th className="p-3.5 whitespace-nowrap">ලියාපදිංචි අංකය</th>
                      <th className="p-3.5 whitespace-nowrap">ජා.හැ. අංකය</th>
                      <th className="p-3.5 whitespace-nowrap">දිස්ත්‍රික්කය</th>
                      <th className="p-3.5 whitespace-nowrap">ප්‍රා.ලේ. කොට්ඨාසය</th>
                      <th className="p-3.5 whitespace-nowrap">ග්‍රා.නි. කොට්ඨාසය</th>
                      <th className="p-3.5 whitespace-nowrap">සේවා කාණ්ඩය</th>
                      <th className="p-3.5 whitespace-nowrap">ව්‍යාපාර ස්වභාවය</th>
                      <th className="p-3.5 whitespace-nowrap">දුරකතන / WhatsApp</th>
                      <th className="p-3.5 whitespace-nowrap">සේවකයින්</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredData.length > 0 ? (
                      filteredData.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-800/40 transition duration-150 group">
                          <td className="p-3.5 font-medium text-white whitespace-nowrap">
                            <div className="font-semibold">{row.name}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{row.address}</div>
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-medium text-cyan-300">
                            {row.businessName}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300">
                              {row.regNo}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-mono text-slate-400">
                            {row.nic}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                              {row.district.split('/')[0]}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-slate-300">
                            {row.dsDivision}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-slate-400">
                            {row.gnDivision}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px]">
                              {row.serviceCategory}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-slate-300">
                            {row.natureOfBusiness}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-slate-400">
                            <div>{row.phone}</div>
                            <div className="text-[10px] text-emerald-400">WA: {row.whatsapp}</div>
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-center font-bold text-slate-200">
                            {row.employees}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="p-8 text-center text-slate-500">
                          <p className="text-sm">කිසිදු දත්තයක් හමු නොවීය.</p>
                          <p className="text-xs mt-1">කරුණාකර පෙළගැස්වීම් නැවත පරීක්ෂා කරන්න.</p>
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

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">නව ව්‍යවසායකයෙකු ඇතුළත් කිරීම</h3>
                  <p className="text-xs text-slate-400">SPDA දත්ත පද්ධතියට නව වාර්තාවක් එක් කරන්න</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">සම්පූර්ණ නම *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="උදා: කේ. ඒ. නිමල් පෙරේරා"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ජාතික හැඳුනුම්පත් අංකය *</label>
                  <input
                    type="text"
                    required
                    value={formData.nic}
                    onChange={(e) => setFormData({...formData, nic: e.target.value})}
                    placeholder="උදා: 851234567V"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ලිපිනය *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="ව්‍යාපාරික හෝ පෞද්ගලික ලිපිනය"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">දුරකතන අංකය *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="0771234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp අංකය</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="0771234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ඊමේල් ලිපිනය</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="example@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">දිස්ත්‍රික්කය *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {Object.keys(dsDivisionsByDistrict).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ප්‍රා.ලේ. කොට්ඨාසය *</label>
                  <input
                    type="text"
                    required
                    value={formData.dsDivision}
                    onChange={(e) => setFormData({...formData, dsDivision: e.target.value})}
                    placeholder="උදා: බෝපෙ-පෝද්දල"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ග්‍රා.නි. කොට්ඨාසය *</label>
                  <input
                    type="text"
                    required
                    value={formData.gnDivision}
                    onChange={(e) => setFormData({...formData, gnDivision: e.target.value})}
                    placeholder="උදා: නාරාවල 122"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ව්‍යාපාරයේ නම *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="උදා: රුහුණු නිෂ්පාදන"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ලියාපදිංචි අංකය *</label>
                  <input
                    type="text"
                    required
                    value={formData.regNo}
                    onChange={(e) => setFormData({...formData, regNo: e.target.value})}
                    placeholder="SPDA/G/2026/001"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">සේවා කාණ්ඩය *</label>
                  <select
                    value={formData.serviceCategory}
                    onChange={(e) => setFormData({...formData, serviceCategory: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {serviceCategories.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ව්‍යාපාරයේ ස්වභාවය *</label>
                  <select
                    value={formData.natureOfBusiness}
                    onChange={(e) => setFormData({...formData, natureOfBusiness: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {natureOfBusinesses.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">සේවක සංඛ්‍යාව *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.employees}
                    onChange={(e) => setFormData({...formData, employees: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-cyan-500/20 transition"
                >
                  දත්ත සුරකින්න
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}