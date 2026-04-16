// ============================================
//  MATHQUIZ — GAME CONTROLLER (main.js)
// ============================================

const Game = {
  state: null,

  init() {
    this.state = SaveSystem.load();
    Particles.init();
    AudioSystem.init(this.state.audioEnabled);
    this._bindAudioToggle();
    this.showScreen('screen-home');
    HomeScreen.init(this.state);
    AudioSystem.playBg();
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });
    const target = document.getElementById(id);
    if (target) {
      requestAnimationFrame(() => {
        target.classList.add('active');
      });
    }
  },

  _bindAudioToggle() {
    const btn = document.getElementById('audio-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      this.state = SaveSystem.toggleAudio(this.state);
      AudioSystem.toggle(this.state);
    });
  },

  startGame() {
    HomeScreen.teardown();
    this.showScreen('screen-map');
  },

  continueGame() {
    HomeScreen.teardown();
    this.showScreen('screen-map');
  },

  startPhase(phaseId) {
    const phaseData = this.state.phases[phaseId - 1];
    if (!phaseData.unlocked) return;
    console.log(`Iniciando fase ${phaseId}`);
    this.showScreen('screen-quiz');
  },

  finishPhase(phaseId, hits, timeBonus, comboBonus) {
    const stars = calcStars(hits);
    const score = calcScore(hits, timeBonus, comboBonus);
    this.state = SaveSystem.updatePhase(this.state, phaseId, stars, score);
    this.showScreen('screen-result');
  }
};

document.addEventListener('DOMContentLoaded', () => Game.init());
