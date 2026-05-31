import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X, Clock, CheckCircle2, AlertCircle,
  Loader2, ChevronLeft, ChevronRight, Hourglass, CalendarDays, Sparkles
} from "lucide-react";
import { useCreateCustomerBookingMutation } from "../../../app/api/BookingApi";

interface ServiceBasic {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  category: string;
  duration?: string;
  provider?: string;
  image?: string;
}

interface CreateBookingProps {
  service: ServiceBasic | null;
  onClose: () => void;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const TIME_SLOTS = [
  "08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00",
];

function todayStr() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}

const CreateBooking: React.FC<CreateBookingProps> = ({ service, onClose }) => {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selDate, setSelDate] = useState<string|null>(null);
  const [selTime, setSelTime] = useState<string|null>(null);
  const [step, setStep] = useState<"pick"|"confirm"|"success"|"error">("pick");
  const [errMsg, setErrMsg] = useState("");
  const [createBooking, { isLoading }] = useCreateCustomerBookingMutation();

  // Lock body scroll while modal is open
  useEffect(() => {
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  if (!service) return null;

  const serviceId = service._id ?? service.id ?? "";
  const tStr = todayStr();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y-1); }
    else setMonth(m => m-1);
    setSelDate(null); setSelTime(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y+1); }
    else setMonth(m => m+1);
    setSelDate(null); setSelTime(null);
  };

  const dayStr = (d: number) =>
    `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const isDisabled = (d: number) => dayStr(d) < tStr;
  const isToday    = (d: number) => dayStr(d) === tStr;

  const handleDay = (d: number) => {
    if (isDisabled(d)) return;
    setSelDate(dayStr(d));
    setSelTime(null);
  };

  const humanDate = selDate
    ? new Date(selDate + "T12:00:00").toLocaleDateString("en-US",{
        weekday:"long", year:"numeric", month:"long", day:"numeric"
      })
    : "";

  const handleBook = async () => {
    if (!selDate || !selTime || !serviceId) return;
    try {
      await createBooking({ service_id: serviceId, booking_time: `${selDate}T${selTime}:00.000Z` }).unwrap();
      setStep("success");
    } catch (err: any) {
      setErrMsg(err?.data?.message ?? "Booking failed. Please try again.");
      setStep("error");
    }
  };

  // ── Shared style tokens ──
  const gold = "#C9A84C";
  const navy = "#1A1A2E";
  const font = '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif';

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(10,10,20,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        fontFamily: font,
        overflowY: "auto",
        isolation: "isolate",
      }}
    >
      <style>{`
        @keyframes bkSlideUp {
          from { opacity:0; transform:translateY(28px) scale(.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .bk-root { animation: bkSlideUp .35s cubic-bezier(.16,1,.3,1) both; }

        /* Calendar day cell */
        .bk-d {
          width:100%; aspect-ratio:1;
          display:flex; align-items:center; justify-content:center;
          border-radius:50%; font-size:12.5px; font-weight:500;
          cursor:pointer; border:none; background:transparent;
          color:#1A1A2E; transition:background .15s, color .15s;
        }
        .bk-d:hover:not(.bk-disabled) { background:#1A1A2E; color:#C9A84C; }
        .bk-d.bk-selected { background:#1A1A2E !important; color:#C9A84C !important; font-weight:700; }
        .bk-d.bk-today:not(.bk-selected) {
          outline:2px solid #C9A84C; outline-offset:-2px; font-weight:700;
        }
        .bk-d.bk-disabled { opacity:.25; cursor:not-allowed; }

        /* Time pill */
        .bk-t {
          padding:7px 0; border-radius:8px; font-size:12px; font-weight:600;
          border:1.5px solid rgba(0,0,0,.1); cursor:pointer; background:#fff;
          color:#1A1A2E; transition:.15s; text-align:center;
        }
        .bk-t:hover:not(:disabled) { border-color:#1A1A2E; background:#f5f0e8; }
        .bk-t.bk-t-sel { background:#1A1A2E !important; color:#C9A84C !important; border-color:#1A1A2E; font-weight:700; }
        .bk-t:disabled { opacity:.3; cursor:not-allowed; }

        /* scrollbar for right panel */
        .bk-scroll::-webkit-scrollbar { width:4px; }
        .bk-scroll::-webkit-scrollbar-track { background:transparent; }
        .bk-scroll::-webkit-scrollbar-thumb { background:rgba(0,0,0,.12); border-radius:4px; }

        /* Responsive: stack panels vertically on smaller screens */
        @media (max-width: 700px) {
          .bk-root { max-width: 100% !important; }
          .bk-root .bk-body-split { flex-direction: column !important; }
          .bk-root .bk-body-split > div { flex: 1 1 auto !important; border-right: none !important; border-bottom: 1px solid rgba(0,0,0,.07); }
          .bk-root .bk-body-split > div:last-child { border-bottom: none; }
        }
      `}</style>

      {/* ══════ MODAL ══════ */}
      <div
        className="bk-root"
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 24px 60px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.05)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 680,
          maxHeight: "min(520px, calc(100vh - 32px))",
          margin: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >

        {/* ─── TOP STRIP ─── */}
        <div style={{
          background:`linear-gradient(135deg, ${navy} 0%, #16213e 100%)`,
          padding:"12px 18px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexShrink:0,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {service.image && (
              <img src={service.image} alt=""
                style={{ width:36, height:36, borderRadius:8, objectFit:"cover",
                         border:"2px solid rgba(201,168,76,.35)", flexShrink:0 }} />
            )}
            <div>
              <span style={{
                display:"inline-block", background:gold, color:navy,
                fontSize:8, fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase",
                padding:"2px 7px", borderRadius:4, marginBottom:4
              }}>{service.category}</span>
              <h2 style={{
                margin:0, color:"#fff", fontSize:13, fontWeight:700, lineHeight:1.3,
                maxWidth:340, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
              }}>{service.name}</h2>
              {service.provider && (
                <p style={{ margin:"2px 0 0", color:"rgba(255,255,255,.45)", fontSize:11 }}>
                  Provider: {service.provider}
                </p>
              )}
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ textAlign:"right" }}>
              <p style={{ margin:0, fontSize:9, color:"rgba(255,255,255,.4)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Base Price</p>
              <p style={{ margin:0, fontSize:18, fontWeight:800, color:gold, lineHeight:1 }}>${service.price}</p>
            </div>
            <button onClick={onClose} style={{
              width:28, height:28, borderRadius:"50%", border:"none",
              background:"rgba(255,255,255,.1)", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
              flexShrink:0
            }}><X size={12}/></button>
          </div>
        </div>

        {/* ─── STEP TABS ─── */}
        {(step==="pick"||step==="confirm") && (
          <div style={{
            display:"flex", borderBottom:"1px solid rgba(0,0,0,.07)",
            background:"#fafafa", flexShrink:0, padding:0
          }}>
            {["Pick Date & Time","Confirm Booking"].map((label,i) => {
              const active = (i===0 && step==="pick") || (i===1 && step==="confirm");
              const done   = i===0 && step==="confirm";
              return (
                <div key={i} style={{
                  flex:1, textAlign:"center", padding:"7px 8px",
                  fontSize:9.5, fontWeight:800, letterSpacing:"0.07em",
                  textTransform:"uppercase",
                  color: active ? navy : done ? gold : "rgba(0,0,0,.28)",
                  borderBottom: active ? `2.5px solid ${navy}` : done ? `2.5px solid ${gold}` : "2.5px solid transparent",
                  transition:".2s",
                }}>
                  {done ? "✓ " : `${i+1}. `}{label}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── BODY: PICK ─── */}
        {step==="pick" && (
          <div className="bk-body-split" style={{ display:"flex", flex:1, overflow:"auto", minHeight:0 }}>

            {/* LEFT — Calendar */}
            <div style={{
              flex:"0 0 280px", padding:"14px 14px 14px 16px",
              borderRight:"1px solid rgba(0,0,0,.07)",
              display:"flex", flexDirection:"column",
              background:"#fff",
            }}>
              {/* Month nav */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <button onClick={prevMonth} style={{
                  width:30, height:30, borderRadius:8,
                  border:"1.5px solid rgba(0,0,0,.1)", background:"#fff",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"
                }}><ChevronLeft size={14} color={navy}/></button>
                <span style={{ fontSize:11.5, fontWeight:700, color:navy }}>
                  {MONTH_NAMES[month]} {year}
                </span>
                <button onClick={nextMonth} style={{
                  width:30, height:30, borderRadius:8,
                  border:"1.5px solid rgba(0,0,0,.1)", background:"#fff",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"
                }}><ChevronRight size={14} color={navy}/></button>
              </div>

              {/* Day headers */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:2 }}>
                {DAY_LABELS.map(d => (
                  <div key={d} style={{
                    textAlign:"center", fontSize:9.5, fontWeight:800,
                    color:"rgba(0,0,0,.3)", letterSpacing:"0.07em",
                    textTransform:"uppercase", padding:"3px 0"
                  }}>{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, flex:1 }}>
                {Array.from({length:firstDay}).map((_,i) => <div key={`e${i}`}/>)}
                {Array.from({length:daysInMonth},(_,i)=>i+1).map(day => {
                  const ds = dayStr(day);
                  return (
                    <button key={day} onClick={() => handleDay(day)}
                      className={[
                        "bk-d",
                        ds===selDate ? "bk-selected" : "",
                        isToday(day) ? "bk-today" : "",
                        isDisabled(day) ? "bk-disabled" : "",
                      ].join(" ")}
                    >{day}</button>
                  );
                })}
              </div>

              {/* Selected date pill */}
              <div style={{ marginTop:8 }}>
                {selDate ? (
                  <div style={{
                    background:"#f5f0e8", borderRadius:10, padding:"9px 12px",
                    border:"1px solid rgba(201,168,76,.25)",
                    display:"flex", alignItems:"center", gap:8
                  }}>
                    <CalendarDays size={13} color={gold} style={{flexShrink:0}}/>
                    <span style={{ fontSize:11, fontWeight:700, color:navy }}>{humanDate}</span>
                  </div>
                ) : (
                  <div style={{
                    background:"rgba(0,0,0,.03)", borderRadius:10, padding:"9px 12px",
                    border:"1px dashed rgba(0,0,0,.1)", textAlign:"center"
                  }}>
                    <span style={{ fontSize:11, color:"rgba(0,0,0,.35)", fontWeight:600 }}>
                      ← Select a date to continue
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Time + Summary */}
            <div className="bk-scroll"
              style={{ flex:1, overflowY:"auto", padding:"14px 16px 14px 14px", display:"flex", flexDirection:"column", gap:12 }}>

              {/* Time slots */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                  <Clock size={13} color={gold}/>
                  <span style={{ fontSize:12, fontWeight:700, color:navy }}>Select a time slot</span>
                  {!selDate && (
                    <span style={{ fontSize:10, color:"rgba(0,0,0,.3)", marginLeft:2 }}>
                      (pick a date first)
                    </span>
                  )}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }}>
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot} disabled={!selDate}
                      onClick={() => setSelTime(slot)}
                      className={["bk-t", selTime===slot ? "bk-t-sel":""].join(" ")}
                    >{slot}</button>
                  ))}
                </div>
              </div>

              {/* Booking summary card (appears when both selected) */}
              {selDate && selTime ? (
                <div style={{
                  background:`linear-gradient(135deg, ${navy} 0%, #16213e 100%)`,
                  borderRadius:14, padding:"16px 18px", marginTop:"auto"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <Sparkles size={14} color={gold}/>
                    <span style={{ fontSize:11, fontWeight:800, color:gold, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                      Your Appointment
                    </span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[
                      { label:"Service", val: service.name },
                      { label:"Date",    val: humanDate },
                      { label:"Time",    val: selTime },
                      { label:"Price",   val: `$${service.price}`, highlight:true },
                    ].map(row => (
                      <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                        <span style={{ fontSize:10.5, color:"rgba(255,255,255,.45)", fontWeight:600, flexShrink:0 }}>{row.label}</span>
                        <span style={{
                          fontSize: row.highlight ? 14 : 11,
                          fontWeight: row.highlight ? 800 : 700,
                          color: row.highlight ? gold : "#fff",
                          textAlign:"right", wordBreak:"break-word"
                        }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  flex:1, display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  gap:8, padding:"20px 0", opacity:0.4
                }}>
                  <CalendarDays size={32} color={navy}/>
                  <p style={{ margin:0, fontSize:12, color:navy, fontWeight:600, textAlign:"center" }}>
                    Pick a date and time<br/>to see your booking summary
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── BODY: CONFIRM ─── */}
        {step==="confirm" && (
          <div className="bk-body-split" style={{ display:"flex", flex:1, overflow:"auto", minHeight:0 }}>

            {/* LEFT — Booking details */}
            <div style={{
              flex:"0 0 280px", padding:"14px 14px 14px 16px",
              borderRight:"1px solid rgba(0,0,0,.07)", overflowY:"auto"
            }} className="bk-scroll">
              <p style={{ margin:"0 0 14px", fontSize:11, fontWeight:800, color:"rgba(0,0,0,.35)", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                Booking Details
              </p>
              <div style={{ borderRadius:12, border:"1px solid rgba(0,0,0,.07)", overflow:"hidden" }}>
                {[
                  { label:"Service",  val: service.name },
                  { label:"Provider", val: service.provider ?? "—" },
                  { label:"Date",     val: humanDate },
                  { label:"Time",     val: selTime! },
                  { label:"Duration", val: service.duration ?? "N/A" },
                  { label:"Price",    val: `$${service.price}`, highlight:true },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{
                    display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                    padding:"11px 14px", gap:8,
                    borderBottom: i<arr.length-1 ? "1px solid rgba(0,0,0,.05)" : "none",
                    background: i%2===0 ? "#fff" : "#fafafa"
                  }}>
                    <span style={{ fontSize:11, color:"rgba(0,0,0,.4)", fontWeight:600, flexShrink:0 }}>{row.label}</span>
                    <span style={{
                      fontSize: row.highlight ? 16 : 12,
                      fontWeight: row.highlight ? 800 : 700,
                      color: row.highlight ? navy : navy,
                      textAlign:"right", wordBreak:"break-word", maxWidth:"60%"
                    }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Pending notice */}
            <div style={{ flex:1, padding:"14px 16px 14px 14px", display:"flex", flexDirection:"column", gap:10, overflowY:"auto" }} className="bk-scroll">
              <p style={{ margin:0, fontSize:11, fontWeight:800, color:"rgba(0,0,0,.35)", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                What happens next?
              </p>

              {[
                { icon:"1", color:"#3b82f6", title:"Request Sent", desc:"Your booking request will be instantly delivered to the service provider." },
                { icon:"2", color:gold,      title:"Awaiting Approval", desc:"The provider reviews your request. Status stays Pending until they respond." },
                { icon:"3", color:"#10b981", title:"Booking Confirmed", desc:"Once approved, you'll be notified and the service is locked in your calendar." },
              ].map(item => (
                <div key={item.title} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{
                    width:28, height:28, borderRadius:"50%", flexShrink:0,
                    background:item.color, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff"
                  }}>{item.icon}</div>
                  <div>
                    <p style={{ margin:0, fontSize:12, fontWeight:700, color:navy }}>{item.title}</p>
                    <p style={{ margin:"3px 0 0", fontSize:11, color:"rgba(0,0,0,.5)", lineHeight:1.55 }}>{item.desc}</p>
                  </div>
                </div>
              ))}

              <div style={{
                marginTop:"auto", background:"rgba(201,168,76,.08)",
                border:"1px solid rgba(201,168,76,.3)", borderRadius:10,
                padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:10
              }}>
                <Hourglass size={15} color={gold} style={{flexShrink:0, marginTop:1}}/>
                <p style={{ margin:0, fontSize:11, color:"rgba(0,0,0,.55)", lineHeight:1.55 }}>
                  No payment is collected now. Charges apply only after the provider <strong>confirms</strong> the booking.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── BODY: SUCCESS ─── */}
        {step==="success" && (
          <div className="bk-body-split" style={{ display:"flex", flex:1, overflow:"auto", minHeight:0 }}>
            {/* Left green check */}
            <div style={{
              flex:"0 0 240px", background:`linear-gradient(160deg, ${navy} 0%, #16213e 100%)`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              padding:"24px 18px", gap:10, borderRight:"1px solid rgba(255,255,255,.05)"
            }}>
              <div style={{
                width:72, height:72, borderRadius:"50%", background:"rgba(16,185,129,.15)",
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <CheckCircle2 size={38} color="#10b981"/>
              </div>
              <div style={{ textAlign:"center" }}>
                <h3 style={{ margin:0, color:"#fff", fontSize:17, fontWeight:700 }}>Request Submitted!</h3>
                <p style={{ margin:"8px 0 0", color:"rgba(255,255,255,.5)", fontSize:12, lineHeight:1.6 }}>
                  {humanDate}<br/>at {selTime}
                </p>
              </div>
            </div>

            {/* Right pending info */}
            <div style={{ flex:1, padding:"18px 18px", overflowY:"auto", display:"flex", flexDirection:"column", justifyContent:"center", gap:12 }} className="bk-scroll">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{
                  width:40, height:40, borderRadius:10, background:"rgba(201,168,76,.12)",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>
                  <Hourglass size={20} color={gold}/>
                </div>
                <div>
                  <p style={{ margin:0, fontSize:14, fontWeight:800, color:navy }}>
                    Awaiting Provider Approval
                  </p>
                  <p style={{ margin:"2px 0 0", fontSize:11, color:"rgba(0,0,0,.45)" }}>
                    Status: <span style={{ color:gold, fontWeight:700 }}>Pending</span>
                  </p>
                </div>
              </div>

              <p style={{ margin:0, fontSize:12.5, color:"rgba(0,0,0,.6)", lineHeight:1.7 }}>
                Your booking for <strong>{service.name}</strong> has been sent to the provider.
                The booking status is currently <strong style={{color:gold}}>Pending</strong> — it will change
                to <strong style={{color:"#10b981"}}>Confirmed</strong> once the provider approves your request.
              </p>

              <div style={{
                background:"#fafafa", borderRadius:12, border:"1px solid rgba(0,0,0,.07)",
                padding:"12px 16px"
              }}>
                {[
                  { label:"Service",  val: service.name },
                  { label:"Date",     val: humanDate },
                  { label:"Time",     val: selTime! },
                  { label:"Status",   val: "Pending Approval", color: gold },
                ].map(row => (
                  <div key={row.label} style={{
                    display:"flex", justifyContent:"space-between",
                    padding:"6px 0", borderBottom:"1px solid rgba(0,0,0,.04)"
                  }}>
                    <span style={{ fontSize:11, color:"rgba(0,0,0,.4)", fontWeight:600 }}>{row.label}</span>
                    <span style={{ fontSize:11, fontWeight:700, color: row.color ?? navy, textAlign:"right", maxWidth:"60%", wordBreak:"break-word" }}>{row.val}</span>
                  </div>
                ))}
              </div>

              <button onClick={onClose} style={{
                width:"100%", height:44, borderRadius:12, fontSize:13, fontWeight:700,
                background:navy, color:"#fff", border:"none", cursor:"pointer",
                marginTop:4
              }}>Done</button>
            </div>
          </div>
        )}

        {/* ─── BODY: ERROR ─── */}
        {step==="error" && (
          <div className="bk-body-split" style={{ display:"flex", flex:1, overflow:"auto", minHeight:0 }}>
            <div style={{
              flex:"0 0 220px", background:"#fef2f2",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              padding:"24px 18px", gap:10, borderRight:"1px solid rgba(239,68,68,.1)"
            }}>
              <div style={{
                width:64, height:64, borderRadius:"50%", background:"rgba(239,68,68,.12)",
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <AlertCircle size={32} color="#ef4444"/>
              </div>
              <div style={{ textAlign:"center" }}>
                <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:"#991b1b" }}>Booking Failed</h3>
              </div>
            </div>
            <div style={{ flex:1, padding:"18px", display:"flex", flexDirection:"column", justifyContent:"center", gap:12 }}>
              <p style={{ margin:0, fontSize:13, color:"rgba(0,0,0,.6)", lineHeight:1.7 }}>{errMsg}</p>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => { setStep("pick"); setErrMsg(""); }} style={{
                  flex:1, height:42, borderRadius:10, fontSize:13, fontWeight:700,
                  border:"1.5px solid rgba(0,0,0,.12)", background:"#fff", color:navy, cursor:"pointer"
                }}>← Try Again</button>
                <button onClick={onClose} style={{
                  flex:1, height:42, borderRadius:10, fontSize:13, fontWeight:700,
                  background:navy, color:"#fff", border:"none", cursor:"pointer"
                }}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ─── FOOTER ─── */}
        {(step==="pick" || step==="confirm") && (
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"10px 18px", borderTop:"1px solid rgba(0,0,0,.07)",
            background:"#fff", gap:10, flexShrink:0
          }}>
            <p style={{ margin:0, fontSize:11, color:"rgba(0,0,0,.35)", fontWeight:500 }}>
              {step==="pick"
                ? (!selDate ? "Select a date to continue" : !selTime ? "Now pick a time slot" : "All set — click Continue")
                : "Review your details above before confirming"
              }
            </p>
            <div style={{ display:"flex", gap:10, flexShrink:0 }}>
              {step==="confirm" && (
                <button onClick={() => setStep("pick")} style={{
                  height:34, paddingInline:14, borderRadius:8, fontSize:11, fontWeight:700,
                  border:"1.5px solid rgba(0,0,0,.12)", background:"#fff", color:navy, cursor:"pointer"
                }}>← Back</button>
              )}
              {step==="pick" ? (
                <button
                  disabled={!selDate || !selTime}
                  onClick={() => setStep("confirm")}
                  style={{
                    height:34, paddingInline:18, borderRadius:8, fontSize:11, fontWeight:700,
                    background: (selDate && selTime) ? navy : "rgba(0,0,0,.08)",
                    color: (selDate && selTime) ? "#fff" : "rgba(0,0,0,.25)",
                    border:"none",
                    cursor: (selDate && selTime) ? "pointer" : "not-allowed",
                  }}
                >Continue →</button>
              ) : (
                <button
                  onClick={handleBook}
                  disabled={isLoading}
                  style={{
                    height:34, paddingInline:18, borderRadius:8, fontSize:11, fontWeight:800,
                    background:gold, color:navy, border:"none",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6
                  }}
                >
                  {isLoading
                    ? <><Loader2 size={14} className="animate-spin"/>Submitting…</>
                    : "✓  Confirm Booking"
                  }
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CreateBooking;
