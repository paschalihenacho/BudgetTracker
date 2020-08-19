let db;

const request = indexedDB.open('budget', 1);
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const budgetStore = db.createObjectStore('budget', { autoIncrement: true }); 
    budgetStore.createIndex('pendingIndex', 'pending');
  };
  function checkDatabase() {
  }