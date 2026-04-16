import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Linking, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors, fonts, BOOKING_URL } from "@/lib/theme";
import { openBooking } from "@/lib/booking";

const BSVCS = [
  {name:"IV Hydration Therapy",price:""},{name:"NAD+ Infusions",price:""},{name:"Glutathione Therapy",price:"$150"},
  {name:"Vitamin C Infusions",price:""},{name:"Custom IV Blend (Myers Cocktail)",price:""},
  {name:"PRP Facial",price:"$299"},{name:"PRP Hair Growth",price:"$249"},{name:"PRP Joint Injection",price:"$249"},
  {name:"Radio Frequency Microneedling with PRP",price:""},{name:"Wellness Add-Ons",price:""},
];
const SLOTS=["11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM"];
const DN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MN=["January","February","March","April","May","June","July","August","September","October","November","December"];

function getNext30(){
  const days:{date:Date;label:string;num:number;isSun:boolean}[]=[];const t=new Date();
  for(let i=1;days.length<30;i++){const d=new Date(t);d.setDate(t.getDate()+i);const w=d.getDay();if(w===1)continue;days.push({date:d,label:DN[w],num:d.getDate(),isSun:w===0});}return days;
}
function fmtDate(d:Date){return`${DN[d.getDay()]}, ${MN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;}

export default function BookingScreen(){
  const router=useRouter();
  const[selSvc,setSelSvc]=useState<number|null>(null);const[visit,setVisit]=useState<"office"|"home"|null>(null);
  const[addr,setAddr]=useState("");const[selDate,setSelDate]=useState<number|null>(null);const[selTime,setSelTime]=useState<string|null>(null);
  const[name,setName]=useState("");const[email,setEmail]=useState("");const[phone,setPhone]=useState("");const[notes,setNotes]=useState("");
  const[done,setDone]=useState(false);
  const days=useMemo(()=>getNext30(),[]);const sd=selDate!==null?days[selDate]:null;const isSun=sd?.isSun??false;

  const submit=()=>{
    if(selSvc===null||!visit||selDate===null||!name||!email||!phone)return;if(!isSun&&!selTime)return;
    const svc=BSVCS[selSvc];const df=fmtDate(days[selDate].date);const tm=isSun?"Sunday \u2014 By Request":selTime;
    const vl=visit==="office"?"Office Visit":"Home Visit";const al=visit==="home"&&addr?`Address: ${addr}\n`:"";
    const subj=`Appointment Request \u2014 ${svc.name} \u2014 ${df}`;
    const body=`NEW APPOINTMENT REQUEST \u2014 Timeless RN Wellness Spa\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nService: ${svc.name}${svc.price?` (${svc.price})`:""}\nVisit Type: ${vl}\n${al}Preferred Date: ${df}\nPreferred Time: ${tm}\n\nNotes: ${notes.trim()||"None provided"}\n\nSubmitted via Timeless RN app.`;
    Linking.openURL(`mailto:timelessrnwellnessspa@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`).catch(()=>{});
    setDone(true);
  };

  if(done)return(
    <View style={s.container}><StatusBar style="dark"/>
      <ScrollView contentContainerStyle={s.confirmS}>
        <View style={s.checkWrap}><View style={s.checkCirc}><Text style={s.checkMark}>{"\u2713"}</Text></View></View>
        <Text style={s.confirmT}>Request Sent</Text>
        <Text style={s.confirmB}>Thank you{name?`, ${name.split(" ")[0]}`:""}.{"\n"}Your request has been prepared in your email app. Once sent we will confirm your booking as soon as possible.</Text>
        <View style={s.confirmCard}>
          <Text style={s.confirmCardT}>TIMELESS RN WELLNESS SPA</Text>
          <Text style={s.confirmCardB}>4909 Alabama Ave{"\n"}Nashville, TN 37029{"\n"}West Nashville \u2014 The Nations{"\n\n"}Tuesday - Saturday: 11am - 7pm{"\n"}Sunday: By Request{"\n"}Monday: Closed{"\n\n"}615-970-2015{"\n"}timelessrnwellnessspa@gmail.com</Text>
        </View>
        <TouchableOpacity style={s.homeBtn} onPress={()=>router.replace("/home")}><Text style={s.homeBtnT}>RETURN HOME</Text></TouchableOpacity>
      </ScrollView>
    </View>);

  const ok=selSvc!==null&&visit&&selDate!==null&&(isSun||selTime)&&name.trim()&&email.trim()&&phone.trim();
  return(
    <View style={s.container}><StatusBar style="light"/>
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={()=>router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity>
        <Text style={s.headerT}>Request Appointment</Text><Text style={s.headerS}>Timeless RN Wellness Spa</Text>
      </View>
      <ScrollView style={s.body} contentContainerStyle={s.bodyC} keyboardShouldPersistTaps="handled">
        <Text style={s.lbl}>SELECT A SERVICE</Text>
        {BSVCS.map((sv,i)=>(
          <TouchableOpacity key={i} style={[s.svcCard,selSvc===i&&s.svcCardA]} onPress={()=>setSelSvc(i)} activeOpacity={0.85}>
            <Text style={s.svcN}>{sv.name}</Text>{sv.price?<Text style={s.svcP}>{sv.price}</Text>:null}
          </TouchableOpacity>))}

        <Text style={[s.lbl,{marginTop:24}]}>VISIT TYPE</Text>
        <View style={s.visitRow}>
          <TouchableOpacity style={[s.visitBtn,visit==="office"&&s.visitBtnA]} onPress={()=>setVisit("office")}><Text style={[s.visitBtnT,visit==="office"&&s.visitBtnTA]}>OFFICE VISIT</Text></TouchableOpacity>
          <TouchableOpacity style={[s.visitBtn,visit==="home"&&s.visitBtnA]} onPress={()=>setVisit("home")}><Text style={[s.visitBtnT,visit==="home"&&s.visitBtnTA]}>HOME VISIT</Text></TouchableOpacity>
        </View>
        {visit==="home"&&<><Text style={[s.lbl,{marginTop:24}]}>YOUR ADDRESS</Text><TextInput style={s.inp} value={addr} onChangeText={setAddr} placeholder="Enter your full address" placeholderTextColor={colors.textMuted}/></>}

        <Text style={[s.lbl,{marginTop:24}]}>PREFERRED DATE</Text>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={days} keyExtractor={(_,i)=>String(i)} contentContainerStyle={s.dateRow}
          renderItem={({item,index})=>(
            <TouchableOpacity style={[s.dateCell,selDate===index&&s.dateCellA]} onPress={()=>{setSelDate(index);setSelTime(null);}} activeOpacity={0.85}>
              <Text style={[s.dateDL,selDate===index&&s.dateDLA]}>{item.label}</Text>
              <Text style={[s.dateN,selDate===index&&s.dateNA]}>{item.num}</Text>
              {item.isSun&&<Text style={[s.dateReq,selDate===index&&s.dateReqA]}>Request</Text>}
            </TouchableOpacity>)}/>

        {sd&&<><Text style={[s.lbl,{marginTop:24}]}>PREFERRED TIME</Text>
          {isSun?<Text style={s.sunNote}>Sunday appointments are by request — please indicate your preferred time in the notes below.</Text>
          :<View style={s.timeGrid}>{SLOTS.map(sl=>(
            <TouchableOpacity key={sl} style={[s.timeSlot,selTime===sl&&s.timeSlotA]} onPress={()=>setSelTime(sl)} activeOpacity={0.85}>
              <Text style={[s.timeSlotT,selTime===sl&&s.timeSlotTA]}>{sl}</Text>
            </TouchableOpacity>))}</View>}</>}

        <Text style={[s.lbl,{marginTop:24}]}>YOUR INFORMATION</Text>
        <TextInput style={s.inp} value={name} onChangeText={setName} placeholder="Full Name" placeholderTextColor={colors.textMuted}/>
        <TextInput style={s.inp} value={email} onChangeText={setEmail} placeholder="Email Address" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none"/>
        <TextInput style={s.inp} value={phone} onChangeText={setPhone} placeholder="Phone Number" placeholderTextColor={colors.textMuted} keyboardType="phone-pad"/>

        <Text style={[s.lbl,{marginTop:24}]}>ADDITIONAL NOTES</Text>
        <TextInput style={[s.inp,s.inpMulti]} value={notes} onChangeText={setNotes} placeholder="Any questions special requests or additional information" placeholderTextColor={colors.textMuted} multiline numberOfLines={4} textAlignVertical="top"/>

        <TouchableOpacity style={[s.submitBtn,!ok&&s.submitDis]} onPress={submit} disabled={!ok} activeOpacity={0.85}>
          <Text style={s.submitT}>SEND REQUEST</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>openBooking()} style={s.sqLink}><Text style={s.sqLinkT}>Or book directly at Square {"\u2192"}</Text></TouchableOpacity>
      </ScrollView>
    </View>);
}

const s=StyleSheet.create({
  container:{flex:1,backgroundColor:colors.cream},
  header:{backgroundColor:colors.warmDark,paddingTop:56,paddingBottom:24,paddingHorizontal:64,alignItems:"center"},
  back:{position:"absolute",top:56,left:20,zIndex:10,padding:8},backT:{fontSize:49,color:colors.gold,lineHeight:52},
  headerT:{fontFamily:fonts.serifLight,fontSize:32,color:colors.creamText,letterSpacing:1,marginBottom:6,textAlign:"center",lineHeight:40},
  headerS:{fontFamily:fonts.serifLightItalic,fontSize:20,color:colors.gold,letterSpacing:2,textAlign:"center",lineHeight:26},
  body:{flex:1},bodyC:{padding:20,paddingBottom:40},
  lbl:{fontFamily:fonts.sans,fontSize:14,letterSpacing:4,color:colors.gold,textTransform:"uppercase",marginBottom:14,lineHeight:20},
  svcCard:{borderWidth:1,borderColor:colors.creamDark,borderRadius:6,paddingVertical:16,paddingHorizontal:16,marginBottom:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:colors.white,gap:10},
  svcCardA:{borderColor:colors.gold,backgroundColor:"rgba(184,137,90,0.08)"},
  svcN:{fontFamily:fonts.serifLight,fontSize:28,color:colors.text,flex:1,lineHeight:36,flexShrink:1},svcP:{fontFamily:fonts.serifLight,fontSize:25,color:colors.gold,marginLeft:12,flexShrink:0},
  visitRow:{flexDirection:"row",gap:10},
  visitBtn:{flex:1,borderWidth:1,borderColor:colors.gold,paddingVertical:14,alignItems:"center",borderRadius:4},
  visitBtnA:{backgroundColor:colors.gold},visitBtnT:{fontFamily:fonts.sansMedium,fontSize:16,letterSpacing:3,color:colors.gold,textTransform:"uppercase",lineHeight:22},visitBtnTA:{color:colors.ink},
  inp:{borderBottomWidth:1,borderBottomColor:"rgba(184,137,90,0.35)",backgroundColor:"transparent",fontFamily:fonts.serifLight,fontSize:22,color:colors.text,paddingVertical:12,marginBottom:18,lineHeight:32},
  inpMulti:{minHeight:96,borderWidth:1,borderColor:"rgba(184,137,90,0.25)",borderRadius:6,paddingHorizontal:14,paddingTop:14,borderBottomWidth:1},
  dateRow:{paddingVertical:4,gap:8},
  dateCell:{width:58,height:72,borderWidth:1,borderColor:colors.gold,borderRadius:8,alignItems:"center",justifyContent:"center",paddingVertical:8},
  dateCellA:{backgroundColor:colors.gold},dateDL:{fontFamily:fonts.sans,fontSize:16,color:colors.textMuted,textTransform:"uppercase",marginBottom:2},dateDLA:{color:colors.ink},
  dateN:{fontFamily:fonts.serifLight,fontSize:35,color:colors.text},dateNA:{color:colors.ink},
  dateReq:{fontFamily:fonts.sansLight,fontSize:14,color:colors.gold,marginTop:2},dateReqA:{color:colors.ink},
  timeGrid:{flexDirection:"row",flexWrap:"wrap",gap:8},
  timeSlot:{width:"31%",borderWidth:1,borderColor:colors.gold,borderRadius:4,paddingVertical:12,alignItems:"center"},
  timeSlotA:{backgroundColor:colors.gold},timeSlotT:{fontFamily:fonts.sans,fontSize:18,color:colors.gold,lineHeight:24},timeSlotTA:{color:colors.ink},
  sunNote:{fontFamily:fonts.serifLightItalic,fontSize:18,color:colors.textMuted,lineHeight:28,marginBottom:10},
  submitBtn:{backgroundColor:colors.gold,paddingVertical:16,alignItems:"center",marginTop:32},submitDis:{opacity:0.45},
  submitT:{fontFamily:fonts.sansMedium,fontSize:18,letterSpacing:5,color:colors.ink,textTransform:"uppercase",lineHeight:24},
  sqLink:{alignItems:"center",marginTop:18,paddingVertical:10},sqLinkT:{fontFamily:fonts.sansLight,fontSize:16,color:colors.textMuted,lineHeight:24},
  confirmS:{flexGrow:1,justifyContent:"center",alignItems:"center",padding:24},
  checkWrap:{marginBottom:24},checkCirc:{width:64,height:64,borderRadius:32,borderWidth:2,borderColor:colors.gold,alignItems:"center",justifyContent:"center"},checkMark:{fontSize:44,color:colors.gold,lineHeight:52},
  confirmT:{fontFamily:fonts.serifLight,fontSize:40,color:colors.text,marginBottom:16,textAlign:"center",lineHeight:48},
  confirmB:{fontFamily:fonts.serifLightItalic,fontSize:20,color:colors.textMuted,lineHeight:32,textAlign:"center",marginBottom:32,paddingHorizontal:8},
  confirmCard:{backgroundColor:colors.creamDark,borderRadius:8,padding:20,width:"100%",marginBottom:28},
  confirmCardT:{fontFamily:fonts.sans,fontSize:14,letterSpacing:3,color:colors.gold,textTransform:"uppercase",marginBottom:12,lineHeight:20},
  confirmCardB:{fontFamily:fonts.sansLight,fontSize:17,color:colors.textMuted,lineHeight:26},
  homeBtn:{borderWidth:1,borderColor:colors.gold,paddingVertical:16,paddingHorizontal:40,borderRadius:4},
  homeBtnT:{fontFamily:fonts.sansMedium,fontSize:16,letterSpacing:4,color:colors.gold,textTransform:"uppercase",lineHeight:22},
});
