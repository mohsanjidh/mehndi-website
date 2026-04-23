/* ══════════════════════════════════════
   TOAST NOTIFICATION ENGINE
   Inspired by react-hot-toast pattern
   Adapted for vanilla JS (no React)
══════════════════════════════════════ */

var _toastState     = { toasts: [] };
var _toastCount     = 0;
var _toastLimit     = 3;
var _toastListeners = [];
var _toastTimeouts  = {};

function _genToastId() {
  _toastCount = (_toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return 'toast_' + _toastCount;
}

function _toastReducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.toast].concat(state.toasts).slice(0, _toastLimit) };
    case 'UPDATE_TOAST':
      return { toasts: state.toasts.map(function(t) {
        return t.id === action.toast.id ? Object.assign({}, t, action.toast) : t;
      })};
    case 'DISMISS_TOAST':
      if (action.toastId) {
        _scheduleToastRemove(action.toastId);
      } else {
        state.toasts.forEach(function(t) { _scheduleToastRemove(t.id); });
      }
      return { toasts: state.toasts.map(function(t) {
        return (t.id === action.toastId || action.toastId === undefined)
          ? Object.assign({}, t, { open: false }) : t;
      })};
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) return { toasts: [] };
      return { toasts: state.toasts.filter(function(t) { return t.id !== action.toastId; }) };
    default:
      return state;
  }
}

function _toastDispatch(action) {
  _toastState = _toastReducer(_toastState, action);
  _toastListeners.forEach(function(fn) { fn(_toastState); });
}

function _scheduleToastRemove(toastId) {
  if (_toastTimeouts[toastId]) return;
  _toastTimeouts[toastId] = setTimeout(function() {
    delete _toastTimeouts[toastId];
    _toastDispatch({ type: 'REMOVE_TOAST', toastId: toastId });
    _removeToastEl(toastId);
  }, 400);
}

function _getOrCreateContainer() {
  var c = document.getElementById('toastContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}

function _renderToast(toast) {
  var container = _getOrCreateContainer();
  if (document.getElementById('toast-' + toast.id)) return;

  var el = document.createElement('div');
  el.id        = 'toast-' + toast.id;
  el.className = 'toast toast-' + (toast.type || 'info');
  el.setAttribute('role', 'alert');
  el.setAttribute('aria-live', 'polite');

  var duration = toast.duration || 4000;

  el.innerHTML =
    '<span class="toast-icon">' + (toast.icon || '&#128276;') + '</span>' +
    '<div class="toast-body">' +
      '<div class="toast-title">' + (toast.title || '') + '</div>' +
      (toast.desc ? '<div class="toast-desc">' + toast.desc + '</div>' : '') +
    '</div>' +
    '<button class="toast-close" aria-label="Close">&#10005;</button>' +
    '<div class="toast-progress" style="animation-duration:' + duration + 'ms"></div>';

  el.querySelector('.toast-close').addEventListener('click', function() {
    dismissToast(toast.id);
  });

  el.addEventListener('click', function(e) {
    if (!e.target.classList.contains('toast-close')) {
      dismissToast(toast.id);
    }
  });

  container.insertBefore(el, container.firstChild);

  setTimeout(function() {
    dismissToast(toast.id, toast.onDismiss);
  }, duration);
}

function _removeToastEl(toastId) {
  var el = document.getElementById('toast-' + toastId);
  if (el) {
    el.classList.add('toast-hide');
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 380);
  }
}

function _dismissToastEl(toastId, callback) {
  var el = document.getElementById('toast-' + toastId);
  if (el) {
    el.classList.add('toast-hide');
    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (typeof callback === 'function') callback();
    }, 380);
  } else {
    if (typeof callback === 'function') callback();
  }
}

/* ── Public Toast API ── */
function showToast(opts) {
  var id    = _genToastId();
  var toast = Object.assign({ id: id, open: true, type: 'info' }, opts);
  _toastDispatch({ type: 'ADD_TOAST', toast: toast });
  _renderToast(toast);
  return id;
}

function dismissToast(toastId, callback) {
  _toastDispatch({ type: 'DISMISS_TOAST', toastId: toastId });
  _dismissToastEl(toastId, callback);
}

function dismissAllToasts() {
  _toastDispatch({ type: 'DISMISS_TOAST' });
  document.querySelectorAll('.toast').forEach(function(el) {
    el.classList.add('toast-hide');
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 380);
  });
}

/* ── Welcome toast shown on home.html ── */
function showWelcomeToast() {
  var name   = sessionStorage.getItem('ia_user');
  var shown  = sessionStorage.getItem('ia_welcome_shown');
  if (!name || shown) return;
  sessionStorage.setItem('ia_welcome_shown', '1');

  setTimeout(function() {
    showToast({
      type:     'success',
      icon:     '&#127775;',
      title:    currentLang === 'ml' ? 'സ്വാഗതം, ' + name + '!' :
                currentLang === 'hi' ? 'स्वागत है, ' + name + '!' :
                                       'Welcome, ' + name + '!',
      desc:     currentLang === 'ml' ? 'ക്യാമ്പസ് പര്യവേക്ഷണം ചെയ്യൂ!' :
                currentLang === 'hi' ? 'कैंपस एक्सप्लोर करें!' :
                                       'You are in! Explore the campus and find rooms.',
      duration: 5000
    });
  }, 600);
}

/* ══════════════════════════════════════
   TRANSLATIONS  (EN / ML / HI)
══════════════════════════════════════ */
var translations = {

  en: {
    loginTitle: 'Inside Ahalia',
    loginSub: 'Enter your details to access the smart campus',
    labelName: 'Your Name',
    placeholderName: 'Enter your full name',
    labelCollege: 'College Name',
    placeholderCollege: 'Enter your college name',
    btnEnter: 'Enter Campus',
    loginTerms: 'By entering, you agree to our terms and conditions',
    welcomeLeft: 'Welcome to Ahalia',
    taglineLeft: 'Where Innovation Meets Education',
    navHome: 'Home',
    navInside: 'Inside Ahalia',
    navAbout: 'About',
    navContact: 'Contact',
    navLogout: 'Logout',
    eyebrow: 'Ahalia Campus · CSE Department',
    heroTitle: 'Navigate Your Campus Like Never Before',
    heroDesc: 'Inside Ahalia is a smart campus navigation system that helps new students, guests, and event participants find every room, floor, and program instantly.',
    statFloors: 'Floors Mapped',
    statRooms: 'Rooms Covered',
    statLive: 'Event Updates',
    whyTitle: 'Why Inside Ahalia?',
    feat1Title: 'Floor-by-Floor Navigation',
    feat1Desc: 'Browse every floor with complete room numbers, names, and directions from the entrance.',
    feat2Title: 'Live Event Guidance',
    feat2Desc: 'On event days, see all workshops, quizzes, and seminars with real-time room assignments.',
    feat3Title: 'QR + 3D Navigation',
    feat3Desc: 'Scan QR codes across campus to get your live position. Unity 3D integration coming next.',
    feat4Title: 'Accessible for Everyone',
    feat4Desc: 'Designed for students, parents, guests, and faculty. Works on any device.',
    insideTitle: 'Explore Inside Ahalia',
    insideSub: 'Choose what you are looking for today',
    campusCard: 'Campus Visit',
    campusDesc: 'Find any room, restroom, staff room, canteen, or board room. Browse floor by floor.',
    campusBtn: 'Explore Campus',
    eventsCard: 'Events',
    eventsDesc: 'View all ongoing and upcoming programs — live updated.',
    eventsBtn: 'View Events',
    campusTitle: 'Campus Directory',
    campusSub: 'Select a floor to see all rooms',
    backBtn: 'Back',
    searchCampus: 'Search rooms, restrooms, canteen...',
    noResults: 'No rooms found. Try a different search.',
    groundFloor: 'Ground Floor',
    firstFloor: '1st Floor',
    roomStaff1: 'Staff Room 1',
    roomBoard: 'Board Room',
    roomCanteen: 'Canteen',
    roomGirlsGF: 'Restroom - Girls (Ground Floor)',
    roomBoysGF: 'Restroom - Boys (Ground Floor)',
    roomStaff2: 'Staff Room 2',
    roomSeminar: 'CSE Seminar Hall',
    roomGirlsF1: 'Restroom - Girls (1st Floor)',
    roomBoysF1: 'Restroom - Boys (1st Floor)',
    roomWelfare: 'Welfare Office',
    roomProject: 'Project Lab',
    typeAdmin: 'Admin',
    typeFacility: 'Facility',
    typeHall: 'Hall',
    typeLab: 'Lab',
    eventsTitle: 'Campus Events',
    eventsSub: 'Live schedule - updates reflect instantly',
    searchEvents: 'Search events, workshops, seminars...',
    noEvents: 'No events found. Check back soon!',
    comingSoon: 'Coming Soon',
    comingTitle: 'Events Are On Their Way',
    comingDesc: 'We are setting up the live event schedule for campus programs, workshops, quizzes, and seminars.',
    comingWork: 'Workshops',
    comingQuiz: 'Quizzes',
    comingSem: 'Seminars',
    aboutCampusTitle: 'About Ahalia Campus',
    aboutCampusText: 'Ahalia School of Engineering & Technology is a premier institution in Palakkad, Kerala, affiliated to APJ Abdul Kalam Technological University.',
    aboutCampusText2: 'The campus spans multiple buildings with labs, classrooms, offices, canteen, library, and research facilities.',
    aboutCSETitle: 'About CSE Department',
    aboutCSEText: 'The CSE Department at Ahalia leads in technological education with expert faculty and well-equipped labs.',
    aboutCSEText2: 'Inside Ahalia was built as a Smart Campus Navigation System by Group 3, CSE Department.',
    contactTitle: 'Contact Info',
    contactInst: 'Institution',
    contactInstVal: 'Ahalia School of Engineering & Technology',
    contactLoc: 'Location',
    contactLocVal: 'Palakkad, Kerala, India',
    contactDept: 'Department',
    contactDeptVal: 'Computer Science & Engineering',
    contactEmail: 'Email',
    teamTitle: 'Project Team - Group 3',
    teamSub: 'Smart Campus Indoor Navigation System',
    teamType: 'Project Type',
    teamTypeVal: 'B.Tech Final Year Project',
    teamStack: 'Tech Stack',
    teamStackVal: 'HTML · CSS · JS · Unity 3D · QR',
    teamYear: 'Academic Year',
    teamYearVal: '2024 - 2025',
    footerDesc: 'Smart Campus Indoor Navigation System for Ahalia Campus.',
    footerNav: 'Navigate',
    footerInfo: 'Information',
    footerInst: 'Institution',
    footerRights: 'All rights reserved.',
    footerBuilt: 'Built by Group 3 · CSE Dept · B.Tech 2024-25',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Use'
  },

  ml: {
    loginTitle: 'ഇന്‍സൈഡ് അഹാലിയ',
    loginSub: 'സ്മാര്‍ട്ട് ക്യാംപസ് ആക്സസ് ചെയ്യാന്‍ വിവരങ്ങള്‍ നല്‍കുക',
    labelName: 'നിങ്ങളുടെ പേര്',
    placeholderName: 'പൂര്‍ണ്ണ നാമം നല്‍കുക',
    labelCollege: 'കോളേജ് പേര്',
    placeholderCollege: 'കോളേജ് പേര് നല്‍കുക',
    btnEnter: 'ക്യാംപസിലേക്ക് കടക്കുക',
    loginTerms: 'പ്രവേശിക്കുന്നതിലൂടെ നിബന്ധനകള്‍ അംഗീകരിക്കുന്നു',
    welcomeLeft: 'അഹാലിയ ക്യാംപസിലേക്ക് സ്വാഗതം',
    taglineLeft: 'നവീകരണം വിദ്യാഭ്യാസത്തെ കണ്ടുമുട്ടുന്നിടം',
    navHome: 'ഹോം',
    navInside: 'ഇന്‍സൈഡ് അഹാലിയ',
    navAbout: 'ഞങ്ങളേക്കുറിച്ച്',
    navContact: 'ബന്ധപ്പെടുക',
    navLogout: 'ലോഗ്ഔട്ട്',
    eyebrow: 'അഹാലിയ ക്യാംപസ് · CSE വിഭാഗം',
    heroTitle: 'ക്യാംപസ് ഇനി എളുപ്പത്തില്‍ നാവിഗേറ്റ് ചെയ്യൂ',
    heroDesc: 'ഇന്‍സൈഡ് അഹാലിയ ഒരു സ്മാര്‍ട്ട് ക്യാംപസ് നാവിഗേഷന്‍ സിസ്റ്റമാണ്.',
    statFloors: 'നിലകള്‍ മാപ്പ് ചെയ്തു',
    statRooms: 'മുറികള്‍ ഉള്‍പ്പെടുന്നു',
    statLive: 'ലൈവ് അപ്ഡേറ്റ്',
    whyTitle: 'എന്തുകൊണ്ട് ഇന്‍സൈഡ് അഹാലിയ?',
    feat1Title: 'നില-നില നാവിഗേഷന്‍',
    feat1Desc: 'ഓരോ നിലയിലും മുറി നമ്പര്‍, പേര്, ദിശ സഹിതം ബ്രൗസ് ചെയ്യൂ.',
    feat2Title: 'ലൈവ് ഇവന്റ് ഗൈഡന്‍സ്',
    feat2Desc: 'ഇവന്റ് ദിവസങ്ങളില്‍ വര്‍ക്ഷോപ്പ്, ക്വിസ്, സെമിനാര്‍ വിവരങ്ങള്‍ കാണൂ.',
    feat3Title: 'QR + 3D നാവിഗേഷന്‍',
    feat3Desc: 'ക്യാംപസില്‍ QR കോഡ് സ്കാന്‍ ചെയ്ത് ലൈവ് ലൊക്കേഷന്‍ അറിയൂ.',
    feat4Title: 'എല്ലാവര്‍ക്കും ആക്സസ് ചെയ്യാം',
    feat4Desc: 'വിദ്യാര്‍ഥികള്‍, രക്ഷിതാക്കള്‍, അതിഥികള്‍ — ഏത് ഉപകരണത്തിലും.',
    insideTitle: 'ഇന്‍സൈഡ് അഹാലിയ പര്യവേക്ഷണം',
    insideSub: 'ഇന്ന് നിങ്ങള്‍ എന്ത് തിരയുന്നു?',
    campusCard: 'ക്യാംപസ് സന്ദര്‍ശനം',
    campusDesc: 'ഏത് മുറി, ടോയ്‌ലറ്റ്, സ്റ്റാഫ് റൂം, കാന്റീന്‍ — നില-നിലയായി കണ്ടെത്തൂ.',
    campusBtn: 'ക്യാംപസ് കാണൂ',
    eventsCard: 'ഇവന്റുകള്‍',
    eventsDesc: 'നടക്കുന്നതും വരാനിരിക്കുന്നതുമായ പ്രോഗ്രാമുകള്‍ കാണൂ.',
    eventsBtn: 'ഇവന്റ് കാണൂ',
    campusTitle: 'ക്യാംപസ് ഡയറക്ടറി',
    campusSub: 'മുറികള്‍ കാണാന്‍ ഒരു നില തിരഞ്ഞെടുക്കൂ',
    backBtn: 'തിരികെ',
    searchCampus: 'മുറി, ടോയ്‌ലറ്റ്, കാന്റീന്‍ തിരയൂ...',
    noResults: 'ഒന്നും കണ്ടെത്തിയില്ല. വേറൊരു പദം ശ്രമിക്കൂ.',
    groundFloor: 'ഗ്രൗണ്ട് ഫ്ലോര്‍',
    firstFloor: 'ഒന്നാം നില',
    roomStaff1: 'സ്റ്റാഫ് റൂം 1',
    roomBoard: 'ബോര്‍ഡ് റൂം',
    roomCanteen: 'കാന്റീന്‍',
    roomGirlsGF: 'ടോയ്‌ലറ്റ് - പെണ്‍കുട്ടികള്‍ (ഗ്രൗണ്ട്)',
    roomBoysGF: 'ടോയ്‌ലറ്റ് - ആണ്‍കുട്ടികള്‍ (ഗ്രൗണ്ട്)',
    roomStaff2: 'സ്റ്റാഫ് റൂം 2',
    roomSeminar: 'CSE സെമിനാര്‍ ഹാള്‍',
    roomGirlsF1: 'ടോയ്‌ലറ്റ് - പെണ്‍കുട്ടികള്‍ (1st)',
    roomBoysF1: 'ടോയ്‌ലറ്റ് - ആണ്‍കുട്ടികള്‍ (1st)',
    roomWelfare: 'ക്ഷേമ ഓഫീസ്',
    roomProject: 'പ്രോജക്ട് ലാബ്',
    typeAdmin: 'അഡ്മിന്‍',
    typeFacility: 'സൗകര്യം',
    typeHall: 'ഹാള്‍',
    typeLab: 'ലാബ്',
    eventsTitle: 'ക്യാംപസ് ഇവന്റുകള്‍',
    eventsSub: 'ലൈവ് ഷെഡ്യൂള്‍',
    searchEvents: 'ഇവന്റ്, വര്‍ക്ഷോപ്പ്, സെമിനാര്‍ തിരയൂ...',
    noEvents: 'ഒന്നും കണ്ടെത്തിയില്ല. ഉടന്‍ വരും!',
    comingSoon: 'ഉടന്‍ വരുന്നു',
    comingTitle: 'ഇവന്റുകള്‍ വരുന്നു',
    comingDesc: 'ക്യാംപസ് പ്രോഗ്രാമുകളുടെ ലൈവ് ഷെഡ്യൂള്‍ തയ്യാറാക്കുകയാണ്.',
    comingWork: 'വര്‍ക്ഷോപ്പുകള്‍',
    comingQuiz: 'ക്വിസ്',
    comingSem: 'സെമിനാറുകള്‍',
    aboutCampusTitle: 'അഹാലിയ ക്യാംപസ് കുറിച്ച്',
    aboutCampusText: 'അഹാലിയ സ്കൂള്‍ ഓഫ് എഞ്ചിനീയറിംഗ് & ടെക്നോളജി കേരളത്തിലെ പ്രമുഖ സ്ഥാപനമാണ്.',
    aboutCampusText2: 'ക്യാംപസില്‍ ലാബ്, ക്ലാസ്മുറി, ഓഫീസ്, കാന്റീന്‍, ലൈബ്രറി ഉണ്ട്.',
    aboutCSETitle: 'CSE വിഭാഗം കുറിച്ച്',
    aboutCSEText: 'CSE വിഭാഗം സോഫ്റ്റ്‌വെയര്‍, AI, സൈബര്‍ സുരക്ഷ മേഖലകളില്‍ വിദ്യാര്‍ഥികളെ തയ്യാറാക്കുന്നു.',
    aboutCSEText2: 'ഇന്‍സൈഡ് അഹാലിയ Group 3 CSE വിദ്യാര്‍ഥികള്‍ നിര്‍മ്മിച്ചതാണ്.',
    contactTitle: 'ബന്ധപ്പെടല്‍ വിവരങ്ങള്‍',
    contactInst: 'സ്ഥാപനം',
    contactInstVal: 'അഹാലിയ സ്കൂള്‍ ഓഫ് എഞ്ചിനീയറിംഗ്',
    contactLoc: 'സ്ഥലം',
    contactLocVal: 'പാലക്കാട്, കേരള, ഇന്ത്യ',
    contactDept: 'വിഭാഗം',
    contactDeptVal: 'കംപ്യൂട്ടര്‍ സയന്‍സ് & എഞ്ചിനീയറിംഗ്',
    contactEmail: 'ഇമെയില്‍',
    teamTitle: 'പ്രോജക്ട് ടീം - ഗ്രൂപ്പ് 3',
    teamSub: 'സ്മാര്‍ട്ട് ക്യാംപസ് നാവിഗേഷന്‍ സിസ്റ്റം',
    teamType: 'പ്രോജക്ട് തരം',
    teamTypeVal: 'B.Tech ഫൈനല്‍ ഇയര്‍ പ്രോജക്ട്',
    teamStack: 'ടെക് സ്റ്റാക്ക്',
    teamStackVal: 'HTML · CSS · JS · Unity 3D · QR',
    teamYear: 'അക്കാദമിക് വര്‍ഷം',
    teamYearVal: '2024 - 2025',
    footerDesc: 'അഹാലിയ ക്യാംപസിനായുള്ള സ്മാര്‍ട്ട് നാവിഗേഷന്‍.',
    footerNav: 'നാവിഗേറ്റ്',
    footerInfo: 'വിവരങ്ങള്‍',
    footerInst: 'സ്ഥാപനം',
    footerRights: 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
    footerBuilt: 'Group 3 · CSE Dept · B.Tech 2024-25 നിര്‍മ്മിച്ചത്',
    footerPrivacy: 'സ്വകാര്യതാ നയം',
    footerTerms: 'ഉപയോഗ നിബന്ധനകള്‍'
  },

  hi: {
    loginTitle: 'इनसाइड अहालिया',
    loginSub: 'स्मार्ट कैंपस एक्सेस करने के लिए विवरण दर्ज करें',
    labelName: 'आपका नाम',
    placeholderName: 'अपना पूरा नाम दर्ज करें',
    labelCollege: 'कॉलेज का नाम',
    placeholderCollege: 'कॉलेज का नाम दर्ज करें',
    btnEnter: 'कैंपस में प्रवेश करें',
    loginTerms: 'प्रवेश करके आप हमारे नियमों से सहमत हैं',
    welcomeLeft: 'अहालिया में आपका स्वागत है',
    taglineLeft: 'जहाँ नवाचार शिक्षा से मिलता है',
    navHome: 'होम',
    navInside: 'इनसाइड अहालिया',
    navAbout: 'हमारे बारे में',
    navContact: 'संपर्क',
    navLogout: 'लॉगआउट',
    eyebrow: 'अहालिया कैंपस · CSE विभाग',
    heroTitle: 'अपने कैंपस को बेहतर नेविगेट करें',
    heroDesc: 'इनसाइड अहालिया एक स्मार्ट कैंपस नेविगेशन सिस्टम है।',
    statFloors: 'मंजिलें मैप की गईं',
    statRooms: 'कमरे शामिल हैं',
    statLive: 'लाइव अपडेट',
    whyTitle: 'इनसाइड अहालिया क्यों?',
    feat1Title: 'मंजिल-दर-मंजिल नेविगेशन',
    feat1Desc: 'हर मंजिल में कमरा नंबर, नाम और दिशाओं के साथ ब्राउज़ करें।',
    feat2Title: 'लाइव इवेंट गाइडेंस',
    feat2Desc: 'वर्कशॉप, क्विज़ और सेमिनार की जानकारी रियल-टाइम में देखें।',
    feat3Title: 'QR + 3D नेविगेशन',
    feat3Desc: 'कैंपस में QR कोड स्कैन करके लाइव लोकेशन जानें।',
    feat4Title: 'सभी के लिए सुलभ',
    feat4Desc: 'छात्र, अभिभावक, मेहमान — किसी भी डिवाइस पर।',
    insideTitle: 'इनसाइड अहालिया एक्सप्लोर करें',
    insideSub: 'आज आप क्या खोज रहे हैं?',
    campusCard: 'कैंपस विज़िट',
    campusDesc: 'कोई भी कमरा, टॉयलेट, स्टाफ रूम, कैंटीन खोजें।',
    campusBtn: 'कैंपस देखें',
    eventsCard: 'इवेंट्स',
    eventsDesc: 'सभी चल रहे और आने वाले प्रोग्राम देखें।',
    eventsBtn: 'इवेंट देखें',
    campusTitle: 'कैंपस डायरेक्टरी',
    campusSub: 'सभी कमरे देखने के लिए एक मंजिल चुनें',
    backBtn: 'वापस',
    searchCampus: 'कमरे, टॉयलेट, कैंटीन खोजें...',
    noResults: 'कुछ नहीं मिला। दूसरा शब्द आजमाएं।',
    groundFloor: 'भूतल',
    firstFloor: 'पहली मंजिल',
    roomStaff1: 'स्टाफ रूम 1',
    roomBoard: 'बोर्ड रूम',
    roomCanteen: 'कैंटीन',
    roomGirlsGF: 'शौचालय - लड़कियां (भूतल)',
    roomBoysGF: 'शौचालय - लड़के (भूतल)',
    roomStaff2: 'स्टाफ रूम 2',
    roomSeminar: 'CSE सेमिनार हॉल',
    roomGirlsF1: 'शौचालय - लड़कियां (1st)',
    roomBoysF1: 'शौचालय - लड़के (1st)',
    roomWelfare: 'कल्याण कार्यालय',
    roomProject: 'प्रोजेक्ट लैब',
    typeAdmin: 'प्रशासन',
    typeFacility: 'सुविधा',
    typeHall: 'हॉल',
    typeLab: 'लैब',
    eventsTitle: 'कैंपस इवेंट्स',
    eventsSub: 'लाइव शेड्यूल',
    searchEvents: 'इवेंट, वर्कशॉप, सेमिनार खोजें...',
    noEvents: 'कुछ नहीं मिला। जल्द आएगा!',
    comingSoon: 'जल्द आ रहा है',
    comingTitle: 'इवेंट्स आने वाले हैं',
    comingDesc: 'कैंपस प्रोग्राम्स का लाइव शेड्यूल तैयार किया जा रहा है।',
    comingWork: 'वर्कशॉप',
    comingQuiz: 'क्विज़',
    comingSem: 'सेमिनार',
    aboutCampusTitle: 'अहालिया कैंपस के बारे में',
    aboutCampusText: 'अहालिया स्कूल ऑफ इंजीनियरिंग, पलक्कड़ में एक प्रमुख संस्थान है।',
    aboutCampusText2: 'कैंपस में लैब, कक्षाएं, कार्यालय, कैंटीन और पुस्तकालय हैं।',
    aboutCSETitle: 'CSE विभाग के बारे में',
    aboutCSEText: 'CSE विभाग छात्रों को सॉफ्टवेयर, AI और साइबर सुरक्षा में तैयार करता है।',
    aboutCSEText2: 'इनसाइड अहालिया Group 3 CSE छात्रों द्वारा बनाया गया है।',
    contactTitle: 'संपर्क जानकारी',
    contactInst: 'संस्थान',
    contactInstVal: 'अहालिया स्कूल ऑफ इंजीनियरिंग',
    contactLoc: 'स्थान',
    contactLocVal: 'पलक्कड़, केरल, भारत',
    contactDept: 'विभाग',
    contactDeptVal: 'कंप्यूटर साइंस एंड इंजीनियरिंग',
    contactEmail: 'ईमेल',
    teamTitle: 'प्रोजेक्ट टीम - ग्रुप 3',
    teamSub: 'स्मार्ट कैंपस नेविगेशन सिस्टम',
    teamType: 'प्रोजेक्ट प्रकार',
    teamTypeVal: 'B.Tech अंतिम वर्ष परियोजना',
    teamStack: 'टेक स्टैक',
    teamStackVal: 'HTML · CSS · JS · Unity 3D · QR',
    teamYear: 'शैक्षणिक वर्ष',
    teamYearVal: '2024 - 2025',
    footerDesc: 'अहालिया कैंपस के लिए स्मार्ट नेविगेशन।',
    footerNav: 'नेविगेट',
    footerInfo: 'जानकारी',
    footerInst: 'संस्थान',
    footerRights: 'सर्वाधिकार सुरक्षित।',
    footerBuilt: 'Group 3 · CSE Dept · B.Tech 2024-25 द्वारा',
    footerPrivacy: 'गोपनीयता नीति',
    footerTerms: 'उपयोग की शर्तें'
  }
};

/* ══════════════════════════════════════
   CORE APP FUNCTIONS
══════════════════════════════════════ */

var currentLang = localStorage.getItem('ia_lang') || 'en';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('ia_lang', lang);
  var t = translations[lang];
  if (!t) return;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT') {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active-lang', btn.getAttribute('data-lang') === lang);
  });
  document.documentElement.setAttribute('lang', lang);
}

function switchLang(lang) {
  applyLang(lang);
}

function setActiveNav() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  var map = {
    'index.html':   'nav-home',
    'home.html':    'nav-home',
    'inside.html':  'nav-inside',
    'campus.html':  'nav-inside',
    'events.html':  'nav-inside',
    'about.html':   'nav-about',
    'contact.html': 'nav-contact'
  };
  var el = document.getElementById(map[page]);
  if (el) el.classList.add('active-nav');
}

/* ── Login ── */
function doLogin() {
  var name    = document.getElementById('inputName').value.trim();
  var college = document.getElementById('inputCollege').value.trim();

  if (!name || !college) {
    showToast({
      type:     'error',
      icon:     '&#9888;',
      title:    currentLang === 'ml' ? 'പൂരിപ്പിക്കൂ' :
                currentLang === 'hi' ? 'कृपया भरें' : 'Missing Details',
      desc:     currentLang === 'ml' ? 'പേരും കോളേജ് പേരും നല്‍കുക.' :
                currentLang === 'hi' ? 'नाम और कॉलेज का नाम दर्ज करें।' :
                                       'Please enter your name and college name.',
      duration: 3000
    });
    return;
  }

  sessionStorage.setItem('ia_user',         name);
  sessionStorage.setItem('ia_college',       college);
  sessionStorage.setItem('ia_college_name',  college);

  showToast({
    type:     'success',
    icon:     '&#127881;',
    title:    currentLang === 'ml' ? 'സ്വാഗതം, ' + name + '!' :
              currentLang === 'hi' ? 'स्वागत है, ' + name + '!' :
                                     'Welcome, ' + name + '!',
    desc:     currentLang === 'ml' ? college + '-ല്‍ നിന്ന് സ്വാഗതം.' :
              currentLang === 'hi' ? college + ' से स्वागत है।' :
                                     'From ' + college + '. Entering smart campus...',
    duration: 2000,
    onDismiss: function() {
      window.location.href = 'home.html';
    }
  });
}

/* ── Logout ── */
function doLogout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

/* ── Guard ── */
function requireLogin() {
  if (!sessionStorage.getItem('ia_user')) {
    window.location.href = 'index.html';
  }
}

/* ── Floor tabs ── */
function showFloor(floorId, btn) {
  document.querySelectorAll('[id^="floor-"]').forEach(function(f) { f.style.display = 'none'; });
  document.querySelectorAll('.floor-tab').forEach(function(t) { t.classList.remove('active-tab'); });
  document.getElementById('floor-' + floorId).style.display = 'grid';
  btn.classList.add('active-tab');
}

/* ── Room search ── */
function filterRooms(val) {
  var q        = val.trim().toLowerCase();
  var clearBtn = document.getElementById('campusClear');
  var noRes    = document.getElementById('campusNoResults');
  var floorRow = document.getElementById('floorTabsRow');
  if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);
  if (!q) {
    if (floorRow) floorRow.style.display = 'flex';
    document.querySelectorAll('[id^="floor-"]').forEach(function(g) { g.style.display = 'none'; });
    var gf = document.getElementById('floor-gf');
    if (gf) gf.style.display = 'grid';
    document.querySelectorAll('.floor-tab').forEach(function(t, i) { t.classList.toggle('active-tab', i === 0); });
    document.querySelectorAll('.room-card').forEach(function(card) {
      card.style.display = '';
      var el = card.querySelector('.room-name');
      el.innerHTML = el.textContent;
    });
    if (noRes) noRes.classList.remove('visible');
    return;
  }
  if (floorRow) floorRow.style.display = 'none';
  document.querySelectorAll('[id^="floor-"]').forEach(function(g) { g.style.display = 'grid'; });
  var found = 0;
  document.querySelectorAll('.room-card').forEach(function(card) {
    var nameEl = card.querySelector('.room-name');
    var name   = nameEl.textContent.toLowerCase();
    var no     = card.querySelector('.room-no').textContent.toLowerCase();
    var typeEl = card.querySelector('.room-type');
    var type   = typeEl ? typeEl.textContent.toLowerCase() : '';
    var match  = name.includes(q) || no.includes(q) || type.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) {
      found++;
      var orig = nameEl.textContent;
      var re   = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      nameEl.innerHTML = orig.replace(re, '<mark>$1</mark>');
    } else {
      nameEl.innerHTML = nameEl.textContent;
    }
  });
  if (noRes) noRes.classList.toggle('visible', found === 0);
}

/* ── Event search ── */
function filterEvents(val) {
  var q = val.trim().toLowerCase();
  var clearBtn = document.getElementById('eventClear');
  var noRes    = document.getElementById('eventNoResults');
  if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);
  if (noRes)    noRes.classList.toggle('visible',    q.length > 0);
}

function clearSearch(type) {
  if (type === 'campus') {
    var el = document.getElementById('campusSearch');
    if (el) { el.value = ''; filterRooms(''); }
  } else {
    var el = document.getElementById('eventSearch');
    if (el) { el.value = ''; filterEvents(''); }
  }
}

/* ── Modals ── */
function openModal(name)  { var m = document.getElementById('modal-' + name); if (m) m.classList.add('open'); }
function closeModal(name) { var m = document.getElementById('modal-' + name); if (m) m.classList.remove('open'); }

/* ── Footer year ── */
function setFooterYear() {
  var el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Hamburger ── */
function toggleNav() {
  var nav = document.querySelector('.nav-links');
  var btn = document.getElementById('hamburgerBtn');
  if (!nav || !btn) return;
  nav.classList.toggle('open');
  btn.classList.toggle('open');
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  setActiveNav();
  setFooterYear();
  applyLang(currentLang);

  document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.addEventListener('click', function(e) { if (e.target === m) m.classList.remove('open'); });
  });

  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function() {
      var nav = document.querySelector('.nav-links');
      var btn = document.getElementById('hamburgerBtn');
      if (nav) nav.classList.remove('open');
      if (btn) btn.classList.remove('open');
    });
  });
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.getElementById('inputName')) doLogin();
});