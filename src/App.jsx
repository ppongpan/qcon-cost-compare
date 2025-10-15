import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const DATA_CONFIG = [{group:"1. ข้อมูลโครงการ",items:[{key:'WA',label:'พื้นที่ผนังทั้งหมด',unit:'ตร.ม.',default:430,isProjectData:true}]},{group:"2. ข้อมูลปริมาณงานโครงสร้างเสริม",items:[{key:'LC',label:'ความยาวเอ็นคสล.',unit:'เมตร',default:229},{key:'LL75',label:'ความยาว Lintel 7.5 cm.',unit:'เมตร',default:208},{key:'LL100',label:'ความยาว Lintel 10 cm.',unit:'เมตร',default:28}]},{group:"3. ราคาวัสดุก่อผนัง",items:[{key:'QCB',label:'ปริมาณอิฐมอญ',unit:'ก้อน/ตร.ม.',default:28},{key:'PCB',label:'ราคาอิฐมอญ',unit:'บาท/ก้อน',default:5.5},{key:'QQ',label:'ปริมาณอิฐมวลเบา',unit:'ก้อน/ตร.ม.',default:8.33},{key:'PQ75',label:'ราคาอิฐมวลเบา 7.5 cm.',unit:'บาท/ก้อน',default:26},{key:'PQ10',label:'ราคาอิฐมวลเบา 10 cm.',unit:'บาท/ก้อน',default:34}]},{group:"4. ราคาวัสดุปูนก่อ/ฉาบ และวัสดุเสริม",items:[{key:'PCAM',label:'ราคาปูนก่ออิฐมอญสำเร็จรูป',unit:'บาท/ถุง',default:96},{key:'PCPM',label:'ราคาปูนฉาบอิฐมอญสำเร็จรูป',unit:'บาท/ถุง',default:123},{key:'PQAM',label:'ราคาปูนก่ออิฐมวลเบา',unit:'บาท/ถุง',default:221},{key:'PQPM',label:'ราคาปูนฉาบอิฐมวลเบา',unit:'บาท/ถุง',default:148},{key:'PAS',label:'ราคาเหล็กหนวดกุ้ง',unit:'บาท/กก.',default:22},{key:'PLC',label:'ราคาเอ็นคสล.',unit:'บาท/เมตร',default:120},{key:'PL75',label:'ราคา Lintel 7.5 cm.',unit:'บาท/เมตร',default:130},{key:'PL100',label:'ราคา Lintel 10 cm.',unit:'บาท/เมตร',default:195}]},{group:"5. ค่าแรง",items:[{key:'LAC',label:'ค่าแรงก่ออิฐมอญ',unit:'บาท/ตร.ม.',default:110},{key:'LPC',label:'ค่าแรงฉาบอิฐมอญ',unit:'บาท/ตร.ม.',default:110},{key:'LAQ',label:'ค่าแรงก่ออิฐมวลเบา',unit:'บาท/ตร.ม.',default:110},{key:'LPQ',label:'ค่าแรงฉาบอิฐมวลเบา',unit:'บาท/ตร.ม.',default:110},{key:'LCL75',label:'ค่าแรงติดตั้ง Lintel 7.5 cm.',unit:'บาท/เมตร',default:12}]}];

const initialDataMap = DATA_CONFIG.flatMap(g => g.items).reduce((acc, item) => ({ ...acc, [item.key]: item.default }), {});

const formatNumber = (num, decimals = 0) => (isNaN(num) || num === null || num === "") ? '0' : Number(num).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const LocalButton = ({ children, onClick, className = "", variant = "primary", disabled = false, type = "button" }) => {
  const base = "px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md transform active:scale-[0.98] w-full text-base whitespace-nowrap";
  const variants = {
    primary: "bg-primary-brand text-white hover:bg-primary-dark hover:shadow-lg",
    secondary: "bg-gray-200 text-accent-black hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-md dark:bg-red-600 dark:hover:bg-red-500"
  };
  return <button type={type} className={`${base} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>;
};

function calculateTable(data, type) {
  const getNum = (key) => parseFloat(data[key]) || 0;
  const { WA, LC, PLC, LL75, PL75, LL100, PL100, QCB, PCB, QQ, PQ75, PQ10, PQAM, PQPM, PCAM, PCPM, PAS, LAC, LPC, LAQ, LPQ, LCL75 } = Object.fromEntries(Object.keys(initialDataMap).map(k => [k, getNum(k)]));
  const calcQ = (val) => Math.ceil(Math.max(0, val));
  let rows = [];
  if (type === "อิฐมอญ + เอ็นคสล.") rows = [{ n: "วัสดุก่อ (อิฐมอญ)", q: calcQ((WA - LC * 0.1) * QCB), u: PCB }, { n: "ปูนก่อ (ถุง)", q: calcQ(WA / 1.2), u: PCAM }, { n: "ปูนฉาบ (ถุง)", q: calcQ((WA * 2) / 1.28), u: PCPM }, { n: "เหล็กหนวดกุ้ง (กก.)", q: calcQ(WA * 0.11), u: PAS }, { n: "เอ็นคสล. (ม.)", q: calcQ(LC), u: PLC }, { n: "Lintel (ม.)", q: 0, u: 0 }, { n: "ค่าแรงก่ออิฐมอญ", q: WA, u: LAC }, { n: "ค่าแรงฉาบอิฐมอญ", q: WA * 2, u: LPC }, { n: "ค่าแรงติดตั้ง Lintel", q: 0, u: 0 }];
  else if (type === "ALC(7.5) & เอ็นคสล.") rows = [{ n: "วัสดุก่อ (ALC 7.5cm)", q: calcQ((WA - LC * 0.1) * QQ), u: PQ75 }, { n: "ปูนก่อ ALC (ถุง)", q: calcQ(WA / 33), u: PQAM }, { n: "ปูนฉาบ ALC (ถุง)", q: calcQ((WA * 2) / 2.5), u: PQPM }, { n: "เหล็กหนวดกุ้ง (กก.)", q: calcQ(WA * 0.11), u: PAS }, { n: "เอ็นคสล. (ม.)", q: calcQ(LC), u: PLC }, { n: "Lintel (ม.)", q: 0, u: 0 }, { n: "ค่าแรงก่อ ALC", q: WA, u: LAQ }, { n: "ค่าแรงฉาบ ALC", q: WA * 2, u: LPQ }, { n: "ค่าแรงติดตั้ง Lintel", q: 0, u: 0 }];
  else if (type === "ALC(7.5) & Lintel") rows = [{ n: "วัสดุก่อ (ALC 7.5cm)", q: calcQ((WA - LL75 * 0.2) * QQ), u: PQ75 }, { n: "ปูนก่อ ALC (ถุง)", q: calcQ(WA / 33), u: PQAM }, { n: "ปูนฉาบ ALC (ถุง)", q: calcQ((WA * 2) / 2.5), u: PQPM }, { n: "เหล็กหนวดกุ้ง (กก.)", q: calcQ(WA * 0.11), u: PAS }, { n: "เอ็นคสล. (ม.)", q: 0, u: 0 }, { n: "Lintel 7.5cm (ม.)", q: calcQ(LL75), u: PL75 }, { n: "ค่าแรงก่อ ALC", q: WA, u: LAQ }, { n: "ค่าแรงฉาบ ALC", q: WA * 2, u: LPQ }, { n: "ค่าแรงติดตั้ง Lintel 7.5cm", q: calcQ(LL75), u: LCL75 }];
  else if (type === "ALC(10) & Lintel") rows = [{ n: "วัสดุก่อ (ALC 10cm)", q: calcQ((WA - LL100 * 0.2) * QQ), u: PQ10 }, { n: "ปูนก่อ ALC (ถุง)", q: calcQ(WA / 25), u: PQAM }, { n: "ปูนฉาบ ALC (ถุง)", q: calcQ((WA * 2) / 2.5), u: PQPM }, { n: "เหล็กหนวดกุ้ง (กก.)", q: calcQ(WA * 0.11), u: PAS }, { n: "เอ็นคสล. (ม.)", q: 0, u: 0 }, { n: "Lintel 10cm (ม.)", q: calcQ(LL100), u: PL100 }, { n: "ค่าแรงก่อ ALC", q: WA, u: LAQ }, { n: "ค่าแรงฉาบ ALC", q: WA * 2, u: LPQ }, { n: "ค่าแรงติดตั้ง Lintel", q: 0, u: 0 }];
  const table = rows.map(r => ({ ...r, t: r.q * r.u }));
  const total = table.reduce((s, r) => s + r.t, 0);
  return { rows: table, total, perSqm: WA > 0 ? total / WA : 0 };
}

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialDataMap);
  const [savedConfigs, setSavedConfigs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qcon_cost_data')) || []; } catch { return []; }
  });
  const [saveName, setSaveName] = useState('');
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [theme, setTheme] = useState('dark');
  const wallTypes = ["อิฐมอญ + เอ็นคสล.", "ALC(7.5) & เอ็นคสล.", "ALC(7.5) & Lintel", "ALC(10) & Lintel"];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const costResults = useMemo(() => {
    const results = wallTypes.map(type => {
      const { total, perSqm } = calculateTable(data, type);
      return { type, total, perSqm: Math.round(perSqm) };
    });
    const validCosts = results.map(r => r.perSqm).filter(c => c > 0);
    return { results, minCost: Math.min(...validCosts) || 0, maxCost: Math.max(...validCosts) || 0 };
  }, [data]);

  function handleSaveConfig() {
    if (!saveName.trim()) return;
    const newConfig = { id: Date.now(), name: saveName.trim(), date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' }), config: data };
    const updated = [newConfig, ...savedConfigs].slice(0, 20);
    localStorage.setItem('qcon_cost_data', JSON.stringify(updated));
    setSavedConfigs(updated);
    setSaveName('');
    setShowSavedModal(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 sm:p-8 transition-colors duration-300">
      <motion.div className="max-w-xl mx-auto md:max-w-3xl lg:max-w-6xl space-y-4 sm:space-y-6" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.45}}>
        <nav className="flex justify-between items-center py-4">
          <div className="w-1/4 flex justify-start">
            {step > 0 && <button onClick={() => setStep(0)} className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-primary-brand hover:bg-gray-300 dark:hover:bg-slate-600 transition-all duration-300" aria-label="Go to home">🏠</button>}
          </div>
          <div className="w-1/2 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-accent-black dark:text-white flex flex-col items-center lg:flex-row lg:justify-center lg:gap-x-3">
              <span className="whitespace-nowrap">Q-CON</span>
              <span className="text-primary-brand">Cost Compare</span>
            </h1>
          </div>
          <div className="w-1/4 flex justify-end">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-primary-brand hover:bg-gray-300 dark:hover:bg-slate-600 transition-all duration-300">🌓</button>
          </div>
        </nav>

        {showSavedModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={() => setShowSavedModal(false)}>
            <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4">
                <h2 className="text-xl font-bold">บันทึก / โหลดการตั้งค่า</h2>
                <input className="w-full mt-3 p-3 rounded border" placeholder="ตั้งชื่อข้อมูล เช่น 'โครงการ A 2567'" value={saveName} onChange={e => setSaveName(e.target.value)} />
                <div className="flex gap-2 mt-3">
                  <LocalButton onClick={handleSaveConfig}>บันทึก</LocalButton>
                  <LocalButton variant="secondary" onClick={() => setShowSavedModal(false)}>ปิด</LocalButton>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold">ข้อมูลที่บันทึกไว้</h3>
                  <ul className="mt-2 divide-y">
                    {savedConfigs.length === 0 && <li className="text-sm text-gray-500">ยังไม่มีข้อมูลที่บันทึกไว้</li>}
                    {savedConfigs.map(c => (
                      <li key={c.id} className="py-2 flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-gray-500">บันทึกเมื่อ: {c.date}</div>
                        </div>
                        <div className="flex gap-2">
                          <LocalButton variant="secondary" onClick={() => { setData(c.config); setShowSavedModal(false); }}>โหลด</LocalButton>
                          <LocalButton variant="danger" onClick={() => { const updated = savedConfigs.filter(x => x.id !== c.id); localStorage.setItem('qcon_cost_data', JSON.stringify(updated)); setSavedConfigs(updated); }}>ลบ</LocalButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 0 && (
          <motion.div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl text-center p-8 sm:p-12" whileHover={{scale:1.01}} transition={{type:'spring', stiffness: 160}}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">เปรียบเทียบต้นทุนวัสดุผนัง</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-8 text-lg">เริ่มต้นตรวจสอบข้อมูลค่าวัสดุ และค่าแรง</p>
            <LocalButton onClick={() => setStep(1)} className="text-xl px-10 py-4 max-w-xs">Start →</LocalButton>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-700 bg-primary-light dark:bg-slate-900/50">
              <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">ขั้นตอนที่ 1: ตั้งค่าข้อมูล</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-wrap gap-2 mb-6 border-b dark:border-slate-700 pb-4">
                <LocalButton variant="secondary" onClick={() => setData(initialDataMap)}>รีเซ็ต</LocalButton>
                <LocalButton variant="secondary" onClick={() => setShowSavedModal(true)}>บันทึก/โหลด ({savedConfigs.length})</LocalButton>
              </div>
              {DATA_CONFIG.map(({group, items}) => (
                <div key={group} className="mb-6">
                  <h3 className="text-lg font-bold mb-3 border-b-2 border-primary-brand/50 pb-1">{group}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {items.map(item => (
                      <div key={item.key} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">{item.label} ({item.unit}){item.isProjectData && <span className="text-red-500">*</span>}</label>
                        <div className="flex items-center">
                          <input type="number" step="0.01" value={data[item.key] === 0 ? '' : data[item.key]} onChange={e => setData(d => ({ ...d, [item.key]: e.target.value === '' ? '' : parseFloat(e.target.value) }))} className="w-full border p-3 text-base rounded-l-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-primary-dark dark:focus:border-primary-brand focus:ring-1 focus:ring-primary-dark dark:focus:ring-primary-brand" />
                          <span className="bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300 p-3 rounded-r-lg font-medium">{item.unit.split('/')[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 sm:p-6 flex justify-end">
              <LocalButton onClick={() => setStep(2)} className="max-w-full sm:max-w-xs">คำนวณและเปรียบเทียบ →</LocalButton>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-700 bg-primary-light dark:bg-slate-900/50">
              <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">ขั้นตอนที่ 2: สรุปเปรียบเทียบต้นทุนต่อตารางเมตร</h2>
            </div>
            <div className="p-4 sm:p-6 overflow-x-auto">
              <table className="min-w-full text-base rounded-lg shadow-xl">
                <thead>
                  <tr className="border-b border-primary-dark/50 dark:border-slate-700 bg-primary-light dark:bg-slate-900/50">
                    <th className="text-left p-4 font-bold text-primary-dark w-3/5">ประเภทผนัง</th>
                    <th className="text-right p-4 font-bold text-primary-dark w-2/5">บาท/ตร.ม.</th>
                  </tr>
                </thead>
                <tbody>
                  {costResults.results.map((r) => {
                    const isMin = r.perSqm > 0 && r.perSqm === costResults.minCost;
                    const isMax = r.perSqm > 0 && r.perSqm === costResults.maxCost;
                    let rowCls = 'bg-white dark:bg-slate-800 even:bg-gray-50 dark:even:bg-slate-800/50';
                    let costCls = 'text-gray-900 dark:text-slate-100';
                    if (isMin) { rowCls = 'bg-green-100/70 dark:bg-green-900/40 border-l-8 border-green-500 dark:border-green-500 font-bold'; costCls = 'text-green-700 dark:text-green-500 font-extrabold text-2xl'; }
                    else if (isMax) { rowCls = 'bg-red-100/70 dark:bg-red-900/40 border-l-8 border-red-500 dark:border-red-500 font-bold'; costCls = 'text-red-700 dark:text-red-500 font-extrabold text-2xl'; }
                    return (
                      <tr key={r.type} className={`border-b border-gray-200 dark:border-slate-700 transition-colors ${rowCls}`}>
                        <td className="p-4 text-left">{r.type}</td>
                        <td className={`text-right p-4 font-mono ${costCls}`}>{formatNumber(r.perSqm)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 sm:p-6 mt-4 flex flex-col sm:flex-row justify-between">
              <LocalButton variant="secondary" onClick={() => setStep(1)} className="order-2 sm:order-1">← แก้ไขข้อมูล</LocalButton>
              <LocalButton onClick={() => setStep(3)} className="order-1 sm:order-2">ดูรายละเอียดเต็ม →</LocalButton>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">ขั้นตอนที่ 3: ตารางเปรียบเทียบแบบเต็ม</h2>
              <LocalButton variant="secondary" onClick={() => setStep(2)} className="w-auto py-2 px-3 text-sm">ย้อนกลับ</LocalButton>
            </div>
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {costResults.results.map(r => {
                const { rows, total, perSqm } = calculateTable(data, r.type);
                const isMin = r.perSqm > 0 && r.perSqm === costResults.minCost;
                const isMax = r.perSqm > 0 && r.perSqm === costResults.maxCost;
                return (
                  <div key={r.type} className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${isMin ? 'border-4 border-green-500' : isMax ? 'border-4 border-red-500' : 'dark:border-slate-700'}`}>
                    <div className="p-4 sm:p-5 border-b bg-primary-light dark:bg-slate-900/50">
                      <div className="flex items-center justify-between">
                        <div className={`font-extrabold ${isMin ? 'text-green-600 dark:text-green-400' : isMax ? 'text-red-600 dark:text-red-400' : 'text-primary-dark'}`}>{r.type}</div>
                        {isMin && <div className="ml-2 text-xs text-green-700 bg-green-100 dark:bg-green-900/50 dark:text-green-300 px-2 py-0.5 rounded-full">ถูกที่สุด 🏆</div>}
                        {isMax && <div className="ml-2 text-xs text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 px-2 py-0.5 rounded-full">แพงที่สุด 🚨</div>}
                      </div>
                    </div>
                    <div className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                              <th className="text-left p-2.5 w-2/5 font-semibold">รายการ</th>
                              <th className="text-right p-2.5 font-semibold">ปริมาณ</th>
                              <th className="text-right p-2.5 font-semibold">ราคา/หน่วย</th>
                              <th className="text-right p-2.5 font-semibold">รวม (บาท)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, i) => (
                              <tr key={i} className={`${row.q === 0 ? 'bg-gray-100 dark:bg-slate-800/80 italic text-gray-500 dark:text-slate-500' : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50'} border-b border-gray-100 dark:border-slate-700/50 transition-colors`}>
                                <td className="p-2.5">{row.n}</td>
                                <td className="text-right p-2.5 font-mono">{formatNumber(row.q)}</td>
                                <td className="text-right p-2.5 font-mono">{formatNumber(row.u, 2)}</td>
                                <td className="text-right p-2.5 font-mono font-semibold">{formatNumber(row.t)}</td>
                              </tr>
                            ))}
                            <tr className="font-bold border-t-2 border-primary-dark/50 dark:border-primary-brand/50 bg-primary-light dark:bg-slate-900/50">
                              <td colSpan="3" className="p-3 text-primary-dark dark:text-primary-brand text-sm">ราคารวม (บาท)</td>
                              <td className="text-right p-3 text-primary-dark dark:text-primary-brand text-base">{formatNumber(total)}</td>
                            </tr>
                            <tr className={`font-extrabold text-white shadow-inner ${isMin ? 'bg-green-600' : isMax ? 'bg-red-600' : 'bg-primary-brand'}`}>
                              <td colSpan="3" className="p-3 text-base sm:text-lg">รวม (บาท/ตร.ม.)</td>
                              <td className="text-right p-3 text-xl sm:text-2xl">{formatNumber(perSqm)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </motion.div>
    </div>
  )
}
