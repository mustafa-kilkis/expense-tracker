const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// LocalStorage'dan verileri çek, yoksa boş dizi başlat
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Rastgele ID oluşturucu (Silme işlemi için gerekli)
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// İşlemi DOM'a (Ekrana) Ekle
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Miktar eksi ise 'minus' sınıfı ekle, artı ise bir şey ekleme
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)} TL</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Bakiyeyi, Geliri ve Gideri Güncelle
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    // reduce metodu ile tüm miktarları topla
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    // Sadece pozitif olanları topla (Gelir)
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    // Sadece negatif olanları topla (Gider)
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `${total} TL`;
    money_plus.innerText = `+${income} TL`;
    money_minus.innerText = `-${expense} TL`;
}

// İşlem Sil (ID'ye göre filtrele)
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// LocalStorage'ı Güncelle
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Form Gönderildiğinde Çalışacak Fonksiyon
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Lütfen bir isim ve miktar girin');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value // Başındaki + string'i number'a çevirir
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
});

// Uygulamayı Başlat
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();