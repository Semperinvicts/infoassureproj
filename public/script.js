const body = document.getElementById('mainBody');
const panel = document.getElementById('rightPanel');
const leftPanel = document.querySelector('.left'); // Select the left login side
const irisL = document.getElementById('irisL'), irisR = document.getElementById('irisR');
const browL = document.getElementById('browL'), browR = document.getElementById('browR');
const cursor = document.getElementById('cursor');
const eyeLbl = document.getElementById('eyeLabel');
const warnTxt = document.getElementById('warnText');
const errMsg = document.getElementById('errMsg');
let attempts = 0;
let isAngry = false;
let currentFlow = 'signin';
const allPanels = ['panelSignup', 'panelSignin'];

function showPanel(id) {
    allPanels.forEach(p => {
        const el = document.getElementById(p);
        el.style.display = 'none';
        el.classList.remove('active');
    });
    const target = document.getElementById(id);
    target.style.display = 'block';
    target.classList.add('active');
}

function switchTab(t) {
    currentFlow = t;
    document.getElementById('tabSignup').classList.toggle('active', t === 'signup');
    document.getElementById('tabSignin').classList.toggle('active', t === 'signin');
    showPanel(t === 'signup' ? 'panelSignup' : 'panelSignin');
    if (t === 'signup' && isAngry) resetAngry();
}

function checkPwComplexity(val) {
    const setRule = (id, pass) => {
        const el = document.getElementById(id);
        el.classList.toggle('pass', pass);
        el.classList.toggle('fail', !pass);
        el.querySelector('.rule-icon').textContent = pass ? '✓' : '○';
    };
    setRule('rule-upper', /[A-Z]/.test(val));
    setRule('rule-lower', /[a-z]/.test(val));
    setRule('rule-length', val.length >= 8);
}

function validateSignup() {
    const nameInput = document.getElementById('suName');
    const emailInput = document.getElementById('suEmail');
    const pwInput = document.getElementById('suPassword');
    let isValid = true;
    
    if (!nameInput.value.trim()) {
        nameInput.classList.add('shake');
        setTimeout(() => nameInput.classList.remove('shake'), 450);
        isValid = false;
    }
    if (!emailInput.value.trim()) {
        emailInput.classList.add('shake');
        setTimeout(() => emailInput.classList.remove('shake'), 450);
        isValid = false;
    }
 
    const pw = pwInput.value;
    if (pw.length < 8 || !/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
        pwInput.classList.add('shake');
        setTimeout(() => pwInput.classList.remove('shake'), 450);
        isValid = false;
    }
    
    return isValid; 
}

function validateLogin() {
    if (isAngry) return false;
    const emailInput = document.getElementById('siEmail');
    const pwInput = document.getElementById('siPassword');

    let isValid = true;
    if (!emailInput.value.trim()) {
        emailInput.classList.add('shake');
        setTimeout(() => emailInput.classList.remove('shake'), 450);
        isValid = false;
    }

    if (!pwInput.value) {
        pwInput.classList.add('shake');
        setTimeout(() => pwInput.classList.remove('shake'), 450);
        isValid = false;
    }

    if (!isValid) return false; 
    
    attempts++;
    pwInput.classList.add('shake'); 
    setTimeout(() => pwInput.classList.remove('shake'), 450);

    if (attempts > 3) {
        triggerAngry();
        return false;
    }

    return true; 
}

function triggerAngry() {
    isAngry = true;
    body.classList.add('angry');
    leftPanel.classList.add('angry-mode'); // Turn left panel red
    browL.setAttribute('d', 'M 20,5 Q 90,12 160,20');
    browR.setAttribute('d', 'M 20,20 Q 90,12 160,5');
    eyeLbl.textContent = 'I  S E E  Y O U';
    warnTxt.classList.add('show');
    const btn = document.getElementById('loginBtn');
    btn.textContent = '🔒 Account Locked';
    btn.style.background = '#5c0000';
}

function resetAngry() {
    isAngry = false; attempts = 0;
    body.classList.remove('angry');
    leftPanel.classList.remove('angry-mode'); // Remove red from left panel
    browL.setAttribute('d', 'M 20,16 Q 90,16 160,16');
    browR.setAttribute('d', 'M 20,16 Q 90,16 160,16');
    eyeLbl.textContent = 'watching you';
    warnTxt.classList.remove('show');
    [1, 2, 3].forEach(i => {
        const dot = document.getElementById('dot' + i);
        if(dot) dot.classList.remove('used');
    });
    const btn = document.getElementById('loginBtn');
    btn.textContent = 'Sign In';
    btn.style.background = '';
}

document.addEventListener('mousemove', (e) => {
    if(!panel) return;
    const r = panel.getBoundingClientRect();
    if (e.clientX >= r.left) {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    } else {
        cursor.style.display = 'none';
    }
    trackEye(irisL, e);
    trackEye(irisR, e);
});

function trackEye(wrap, e) {
    if(!wrap) return;
    const r = wrap.parentElement.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const limit = 24;
    const c = Math.min(d, limit);
    const fx = (dx / d) * c, fy = (dy / d) * c;
    wrap.style.transform = `translate(calc(-50% + ${fx}px), calc(-50% + ${fy}px))`;
}