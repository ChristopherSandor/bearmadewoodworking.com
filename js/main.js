const { createApp } = Vue;

createApp({
  data() {
    return {
      projects: [],
      loading: true,
      imgBase: 'img/',        // adjust if needed
      jsonPath: 'project.json'// adjust path if needed
    };
  },
  methods: {
    imgSrc(filename) {
      // handle full URLs or plain filenames
      if (!filename) return this.imgBase + 'placeholder.jpg';
      return filename.startsWith('http') ? filename : this.imgBase + filename;
    },
    async loadProjects() {
      try {
        const res = await fetch(this.jsonPath, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Expecting an array of objects:
        // [{ name, text, year, img }, ...]
        this.projects = Array.isArray(data) ? data : (data.projects || []);
      } catch (e) {
        console.error('Failed to load project.json:', e);
        this.projects = [];
      } finally {
        this.loading = false;
        // If using AOS, refresh after DOM updates
        this.$nextTick(() => {
          if (window.AOS?.refreshHard) AOS.refreshHard();
          else if (window.AOS?.refresh) AOS.refresh();
        });
      }
    }
  },
  mounted() {
    this.loadProjects();
  }
}).mount('#app');