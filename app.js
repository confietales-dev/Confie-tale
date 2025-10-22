// app.js

// ====== MENU TOGGLE ======
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  menu.classList.toggle('active');
});

// ====== PARTICLE EFFECT ======
const hero = document.getElementById('hero');
for(let i=0; i<30; i++){
  let particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.width = `${Math.random()*6+4}px`;
  particle.style.height = particle.style.width;
  particle.style.left = `${Math.random()*100}%`;
  particle.style.top = `${Math.random()*100}%`;
  particle.style.animationDuration = `${Math.random()*10+5}s`;
  hero.appendChild(particle);
}

// ====== FIREBASE INITIALIZATION ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkfB1jZfkdzNwh9nWAau74GZn2EDunEK4",
  authDomain: "confie-tales.firebaseapp.com",
  projectId: "confie-tales",
  storageBucket: "confie-tales.firebasestorage.app",
  messagingSenderId: "528057107081",
  appId: "1:528057107081:web:d590e4c3325b70ffbefc58",
  measurementId: "G-T8EWYSPZ1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ====== SIMPLE LOGIN SIGNUP EXAMPLE ======
const loginBtn = document.querySelector('.btn'); // you can adjust selectors
loginBtn.addEventListener('click', () => {
  const email = prompt("Enter your email");
  const password = prompt("Enter your password");
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => { alert("Logged in!"); })
    .catch((error) => { alert(error.message); });
});

// ====== CHAT FUNCTIONALITY ======
const messagesDiv = document.getElementById('messages'); // Add this div in community.html later
const msgInput = document.getElementById('msgInput');    // Add input
const sendBtn = document.getElementById('sendBtn');      // Add button

function renderMessage(doc) {
  const div = document.createElement('div');
  div.textContent = `${doc.data().email}: ${doc.data().message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

if(messagesDiv && sendBtn && msgInput){
  const chatQuery = query(collection(db, 'chat'), orderBy('timestamp'));
  onSnapshot(chatQuery, snapshot => {
    messagesDiv.innerHTML = '';
    snapshot.forEach(doc => renderMessage(doc));
  });

  sendBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if(!user) { alert("Login first"); return; }
    const message = msgInput.value.trim();
    if(message.length === 0) return;
    addDoc(collection(db, 'chat'), {
      email: user.email,
      message: message,
      timestamp: serverTimestamp()
    })
    .then(() => msgInput.value = '')
    .catch(err => alert(err.message));
  });
}
