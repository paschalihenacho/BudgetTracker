let db;

const request = indexedDB.open('budget', 1);
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const budgetStore = db.createObjectStore('budget', { autoIncrement: true }); 
    budgetStore.createIndex('pendingIndex', 'pending');
  };
  function checkDatabase() {
  }
  request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
      checkDatabase();
    }
  };
  request.onerror = function (event) {
    console.log('There has been an error with retrieving your data: ' + request.error);
  };
  function saveRecord(record) {
    const transaction = db.transaction(['budget'], 'readwrite');
    const budgetStore = transaction.objectStore('budget');
    budgetStore.add(record);
  }
  function checkDatabase() {
    const transaction = db.transaction(['budget'], 'readwrite');
    const budgetStore = transaction.objectStore('budget');
    const getRequest = budgetStore.getAll();
  
    getRequest.onsuccess = function () {
      if (getRequest.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getRequest.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(() => {
            const transaction = db.transaction(['budget'], 'readwrite');
            const budgetStore = transaction.objectStore('budget');
            budgetStore.clear();
          });
      }
    };
  }
  window.addEventListener('online', checkDatabase);