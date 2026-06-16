window.ImportExport = {
  init: () => {
    document.getElementById('btn-export').addEventListener('click', () => {
      const dataStr = Storage.exportData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'repovault-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    const fileInput = document.getElementById('input-import');
    document.getElementById('btn-import-trigger').addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if(Storage.importData(ev.target.result)) {
          alert('Data imported successfully!');
          window.location.reload();
        } else {
          alert('Invalid backup file.');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-clear-data').addEventListener('click', () => {
      if(confirm('Are you sure you want to delete ALL data? This cannot be undone.')){
        localStorage.removeItem('repovault_bookmarks');
        localStorage.removeItem('repovault_settings');
        window.location.reload();
      }
    });
  }
};