import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Linking, ActivityIndicator, TextInput, Platform } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors, fonts } from "@/lib/theme";

type Props = { isOpen: boolean; onClose: () => void };
type ModalKey = null|"about"|"team"|"location"|"contact"|"history"|"privacy"|"terms";
type Appointment = { id: string; service: string; appointment_date: string; notes: string };

const ADMIN_EMAIL = "timelessrnwellnessspa@gmail.com";

const MODALS: Record<string,{title:string;body:string}> = {
  about:{title:"ABOUT TIMELESS RN",body:"Timeless RN Wellness Spa was established in 2017 and is located in West Nashville, The Nations. We specialize in evidence-based, nurse-administered IV therapies and wellness solutions. All treatments are administered by Registered Nurses under the guidance of Medical Director Dr. Lawrence Jackson Jr.\n\nOur mission is to provide safe, effective, and convenient therapies that support your energy, immunity, recovery, and longevity."},
  team:{title:"OUR TEAM",body:"Our team is led by Registered Nurses with clinical experience in hydration, aesthetics, and regenerative therapies.\n\nMedical Director: Dr. Lawrence Jackson Jr. \u2014 provides oversight for all protocols and treatments.\n\nEvery session at Timeless RN is personally administered by a licensed RN, ensuring the highest level of safety and care."},
  location:{title:"LOCATION & HOURS",body:"4909 Alabama Ave\nNashville, TN 37029\nWest Nashville \u2014 The Nations\n\nTuesday - Saturday: 11am - 7pm\nSunday: By Request\nMonday: Closed\n\n615-970-2015\ntimelessrnwellnessspa@gmail.com"},
  contact:{title:"CONTACT US",body:"We\u2019d love to hear from you.\n\nPhone: 615-970-2015\nEmail: timelessrnwellnessspa@gmail.com\n\n4909 Alabama Ave\nNashville, TN 37029\nWest Nashville \u2014 The Nations"},
  history:{title:"APPOINTMENT HISTORY",body:""},
  privacy:{title:"PRIVACY POLICY",body:"Timeless RN takes your privacy seriously. Your personal and health information is stored securely and never sold or shared with third parties.\n\nAll treatment records are maintained in accordance with HIPAA standards.\n\nFor questions about your data please contact us at timelessrnwellnessspa@gmail.com."},
  terms:{title:"TERMS OF USE",body:"By using the Timeless RN app you agree to use this service for your personal wellness. All treatments are subject to nurse screening and medical director approval.\n\nTimeless RN is not a substitute for emergency medical care. If you are experiencing a medical emergency please call 911.\n\nYour continued use of the app constitutes acceptance of these terms."},
};

export default function DrawerMenu({ isOpen, onClose }: Props) {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const drawerWidth = Math.min(screenWidth * 0.82, 360);
  const slide = useRef(new Animated.Value(drawerWidth)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(isOpen);
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      Animated.parallel([Animated.timing(slide,{toValue:0,duration:280,useNativeDriver:false}),Animated.timing(fade,{toValue:1,duration:280,useNativeDriver:false})]).start();
      supabase.auth.getUser().then(({data:{user}})=>{setIsAdmin(user?.email===ADMIN_EMAIL);});
    }
    else { Animated.parallel([Animated.timing(slide,{toValue:drawerWidth,duration:220,useNativeDriver:false}),Animated.timing(fade,{toValue:0,duration:220,useNativeDriver:false})]).start(({finished})=>{if(finished)setRendered(false);}); }
  }, [isOpen, drawerWidth]);

  const go=(p:string)=>{onClose();setTimeout(()=>router.push(p as any),240);};
  const modal=(k:Exclude<ModalKey,null>)=>{onClose();setTimeout(()=>setActiveModal(k),240);};
  const signOut=async()=>{try{await supabase.auth.signOut();}catch{}onClose();setTimeout(()=>router.replace("/"),240);};

  return (<>
    {rendered&&<View style={s.root} pointerEvents="auto">
      <Animated.View style={[s.overlay,{opacity:fade}]}><TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose}/></Animated.View>
      <Animated.View style={[s.drawer,{width:drawerWidth,transform:[{translateX:slide}]}]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}><Text style={s.closeX}>{"\u2715"}</Text></TouchableOpacity>
          <Text style={s.brandT}>TIMELESS RN</Text><Text style={s.brandS}>Wellness Spa</Text><View style={s.brandDiv}/>

          <Text style={s.secLbl}>NAVIGATION</Text>
          <MI l="Home" o={()=>go("/home")}/><MI l="Services" o={()=>go("/services")}/><MI l="Membership" o={()=>go("/membership")}/><MI l="Book Now" o={()=>go("/booking")}/><MI l="IV Therapy Pre-Screening" o={()=>{onClose();Linking.openURL("https://forms.gle/WzaPRFrgqk9rHTro7").catch(()=>{});}}/><MI l="NAD Pre-Screening" o={()=>{onClose();Linking.openURL("https://forms.gle/Wrdnz5DnvCSnBinQ6").catch(()=>{});}}/><MI l="Send Us a Message" o={()=>{onClose();Linking.openURL("sms:16159702015").catch(()=>{});}}/>

          <Text style={s.secLbl}>ACCOUNT</Text>
          <MI l="My Profile" o={()=>go("/profile")}/><MI l="Notifications" o={()=>go("/profile")}/><MI l="Appointment History" o={()=>modal("history")}/>

          {isAdmin && <><Text style={s.secLbl}>ADMIN</Text><MI l="Manage Appointments" o={()=>go("/admin")}/></>}

          <Text style={s.secLbl}>INFO</Text>
          <MI l="About Timeless RN" o={()=>modal("about")}/><MI l="Our Team" o={()=>modal("team")}/><MI l="Location & Hours" o={()=>modal("location")}/><MI l="Contact Us" o={()=>modal("contact")}/>

          <Text style={s.secLbl}>LEGAL</Text>
          <MI l="Privacy Policy" o={()=>modal("privacy")}/><MI l="Terms of Use" o={()=>modal("terms")}/>

          <View style={s.botDiv}/><TouchableOpacity onPress={signOut} style={s.soBtn}><Text style={s.soT}>SIGN OUT</Text></TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>}
    {(Object.keys(MODALS) as (keyof typeof MODALS)[]).filter(k=>k!=="history").map(k=><InfoModal key={k} visible={activeModal===k} title={MODALS[k].title} body={MODALS[k].body} onClose={()=>setActiveModal(null)} showMapBtn={k==="location"}/>)}
    <HistoryModal visible={activeModal==="history"} onClose={()=>setActiveModal(null)}/>
  </>);
}

function MI({l,o}:{l:string;o:()=>void}){return<TouchableOpacity style={s.mi} onPress={o} activeOpacity={0.7}><Text style={s.miT}>{l}</Text></TouchableOpacity>;}

const PATIENT_SERVICES = [
  "IV Hydration Therapy","NAD+ Infusions","Glutathione Therapy","Vitamin C Infusions",
  "Custom IV Blend","PRP Facial","PRP Hair Growth","PRP Joint Injection",
  "RF Microneedling with PRP","Wellness Add-Ons",
];

function showAlert(t:string,msg:string){if(Platform.OS==="web")window.alert(`${t}\n\n${msg}`);else{const{Alert}=require("react-native");Alert.alert(t,msg);}}

function HistoryModal({visible,onClose}:{visible:boolean;onClose:()=>void}){
  const[loading,setLoading]=useState(false);
  const[appointments,setAppointments]=useState<Appointment[]>([]);
  const[showForm,setShowForm]=useState(false);
  const[service,setService]=useState("");
  const[date,setDate]=useState("");
  const[notes,setNotes]=useState("");
  const[saving,setSaving]=useState(false);

  const load=async()=>{
    setLoading(true);
    const{data:{user}}=await supabase.auth.getUser();
    if(!user){setLoading(false);return;}
    const{data}=await supabase.from("appointments").select("id, service, appointment_date, notes").eq("profile_id",user.id).order("appointment_date",{ascending:false});
    setAppointments(data||[]);
    setLoading(false);
  };

  useEffect(()=>{if(visible){load();setShowForm(false);setService("");setDate("");setNotes("");}},[visible]);

  const save=async()=>{
    if(!service||!date){showAlert("Missing info","Please select a service and enter the date.");return;}
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){showAlert("Invalid date","Use YYYY-MM-DD format (e.g. 2026-04-16).");return;}
    setSaving(true);
    const{data:{user}}=await supabase.auth.getUser();
    if(!user){setSaving(false);return;}
    const{error}=await supabase.from("appointments").insert({profile_id:user.id,service,appointment_date:date,notes:notes.trim()});
    if(error){showAlert("Error",error.message);}
    else{showAlert("Saved","Visit logged successfully.");setShowForm(false);setService("");setDate("");setNotes("");load();}
    setSaving(false);
  };

  if(!visible)return null;
  return(<View style={m.root}><TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose}/>
    <View style={m.card}><Text style={m.title}>APPOINTMENT HISTORY</Text><View style={m.div}/>
      <ScrollView style={m.bs} showsVerticalScrollIndicator={false}>
        {loading&&<ActivityIndicator color={colors.gold} style={{marginTop:16}}/>}
        {!loading&&!showForm&&appointments.length===0&&<Text style={m.body}>No visits recorded yet.{"\n\n"}Tap below to log your first visit.</Text>}
        {!loading&&!showForm&&appointments.map(a=>(
          <View key={a.id} style={m.apptCard}>
            <Text style={m.apptService}>{a.service}</Text>
            <Text style={m.apptDate}>{a.appointment_date}</Text>
            {a.notes?<Text style={m.apptNotes}>{a.notes}</Text>:null}
          </View>
        ))}
        {!loading&&showForm&&<>
          <Text style={m.formLbl}>SERVICE</Text>
          <View style={m.svcGrid}>{PATIENT_SERVICES.map(sv=>(
            <TouchableOpacity key={sv} style={[m.svcChip,service===sv&&m.svcChipA]} onPress={()=>setService(sv)} activeOpacity={0.8}>
              <Text style={[m.svcChipT,service===sv&&m.svcChipTA]}>{sv}</Text>
            </TouchableOpacity>
          ))}</View>
          <Text style={m.formLbl}>DATE (YYYY-MM-DD)</Text>
          <TextInput style={m.formInp} value={date} onChangeText={setDate} placeholder="2026-04-16" placeholderTextColor={colors.textMuted}/>
          <Text style={m.formLbl}>NOTES (OPTIONAL)</Text>
          <TextInput style={[m.formInp,{minHeight:60}]} value={notes} onChangeText={setNotes} placeholder="Any notes..." placeholderTextColor={colors.textMuted} multiline/>
          <TouchableOpacity style={[m.mapBtn,saving&&{opacity:0.6}]} onPress={save} disabled={saving} activeOpacity={0.85}>
            {saving?<ActivityIndicator color={colors.ink}/>:<Text style={m.mapBtnT}>SAVE VISIT</Text>}
          </TouchableOpacity>
        </>}
      </ScrollView>
      {!showForm&&<TouchableOpacity onPress={()=>setShowForm(true)} style={m.mapBtn} activeOpacity={0.85}><Text style={m.mapBtnT}>LOG A VISIT</Text></TouchableOpacity>}
      <TouchableOpacity onPress={()=>{if(showForm){setShowForm(false);}else{onClose();}}} style={m.closeBtn}><Text style={m.closeBtnT}>{showForm?"BACK":"CLOSE"}</Text></TouchableOpacity>
    </View></View>);
}

function InfoModal({visible,title,body,onClose,showMapBtn}:{visible:boolean;title:string;body:string;onClose:()=>void;showMapBtn?:boolean}){
  if(!visible)return null;
  return(<View style={m.root}><TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose}/>
    <View style={m.card}><Text style={m.title}>{title}</Text><View style={m.div}/>
      <ScrollView style={m.bs} showsVerticalScrollIndicator={false}><Text style={m.body}>{body}</Text></ScrollView>
      {showMapBtn&&<TouchableOpacity onPress={()=>Linking.openURL("https://www.google.com/maps/search/?api=1&query=4909+Alabama+Ave+Nashville+TN+37029")} style={m.mapBtn} activeOpacity={0.85}><Text style={m.mapBtnT}>OPEN IN MAPS</Text></TouchableOpacity>}
      <TouchableOpacity onPress={onClose} style={m.closeBtn}><Text style={m.closeBtnT}>CLOSE</Text></TouchableOpacity>
    </View></View>);
}

const s=StyleSheet.create({
  root:{position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:999},
  overlay:{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(10,8,6,0.8)"},
  drawer:{position:"absolute",top:0,right:0,bottom:0,backgroundColor:colors.ink,borderLeftWidth:1,borderLeftColor:"rgba(184,137,90,0.15)",paddingTop:60,paddingHorizontal:24,paddingBottom:40},
  closeBtn:{position:"absolute",top:12,right:4,padding:8,zIndex:10},closeX:{fontSize:32,color:colors.gold},
  brandT:{fontFamily:fonts.serifLight,fontSize:39,color:colors.creamText,letterSpacing:6},
  brandS:{fontFamily:fonts.serifLightItalic,fontSize:23,color:colors.gold,letterSpacing:2,marginTop:4},
  brandDiv:{height:1,backgroundColor:"rgba(184,137,90,0.2)",marginVertical:16},
  secLbl:{fontFamily:fonts.sans,fontSize:14,letterSpacing:3,color:colors.gold,textTransform:"uppercase",marginTop:22,marginBottom:10},
  mi:{paddingVertical:11,borderBottomWidth:1,borderBottomColor:"rgba(255,255,255,0.04)"},
  miT:{fontFamily:fonts.serifLight,fontSize:32,color:colors.creamText},
  botDiv:{height:1,backgroundColor:"rgba(184,137,90,0.2)",marginTop:32,marginBottom:16},
  soBtn:{paddingVertical:10,alignItems:"center"},soT:{fontFamily:fonts.sans,fontSize:18,letterSpacing:3,color:"rgba(184,137,90,0.5)",textTransform:"uppercase"},
});
const m=StyleSheet.create({
  root:{position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:1000,backgroundColor:"rgba(10,8,6,0.9)",justifyContent:"center",alignItems:"center",padding:24},
  card:{width:"100%",maxWidth:460,backgroundColor:colors.warmDark,borderWidth:1,borderColor:"rgba(184,137,90,0.2)",borderRadius:12,padding:24},
  title:{fontFamily:fonts.sans,fontSize:18,color:colors.gold,letterSpacing:4,textAlign:"center",textTransform:"uppercase"},
  div:{height:1,backgroundColor:"rgba(184,137,90,0.2)",marginTop:14,marginBottom:16},
  bs:{maxHeight:360},body:{fontFamily:fonts.sansLight,fontSize:25,lineHeight:39,color:"rgba(245,239,228,0.8)"},
  apptCard:{backgroundColor:"rgba(184,137,90,0.08)",borderWidth:1,borderColor:"rgba(184,137,90,0.12)",borderRadius:8,padding:14,marginBottom:10},
  apptService:{fontFamily:fonts.sansMedium,fontSize:16,color:colors.creamText,letterSpacing:1},
  apptDate:{fontFamily:fonts.sansLight,fontSize:14,color:colors.gold,marginTop:4,letterSpacing:2},
  apptNotes:{fontFamily:fonts.sansLight,fontSize:14,color:"rgba(245,239,228,0.6)",marginTop:6,lineHeight:20},
  formLbl:{fontFamily:fonts.sans,fontSize:12,letterSpacing:3,color:colors.gold,textTransform:"uppercase",marginBottom:8,marginTop:14},
  svcGrid:{flexDirection:"row",flexWrap:"wrap",gap:6},
  svcChip:{borderWidth:1,borderColor:"rgba(184,137,90,0.3)",borderRadius:6,paddingVertical:8,paddingHorizontal:12},
  svcChipA:{backgroundColor:colors.gold,borderColor:colors.gold},
  svcChipT:{fontFamily:fonts.sansLight,fontSize:13,color:colors.creamText},
  svcChipTA:{color:colors.ink},
  formInp:{fontFamily:fonts.sansLight,fontSize:16,color:colors.creamText,borderBottomWidth:1,borderBottomColor:"rgba(184,137,90,0.3)",paddingVertical:8,marginBottom:4,lineHeight:22},
  mapBtn:{marginTop:20,backgroundColor:colors.gold,borderRadius:6,paddingVertical:12,alignItems:"center"},
  mapBtnT:{fontFamily:fonts.sansMedium,fontSize:16,color:colors.ink,letterSpacing:4,textTransform:"uppercase"},
  closeBtn:{marginTop:12,borderWidth:1,borderColor:colors.gold,borderRadius:6,paddingVertical:12,alignItems:"center"},
  closeBtnT:{fontFamily:fonts.sansMedium,fontSize:16,color:colors.gold,letterSpacing:4,textTransform:"uppercase"},
});
