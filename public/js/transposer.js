const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_MAP = { "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#" };

let currentTranspose = 0;
let rawContent = "";

function transposeChord(chord, semitones) {
  const match = chord.match(/^([A-G][#b]?)(.*)/);
  if (!match) return chord;

  let [, root, suffix] = match;
  root = FLAT_MAP[root] || root;

  const index = CHROMATIC.indexOf(root);
  if (index === -1) return chord;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  return CHROMATIC[newIndex] + suffix;
}

function parseChordPro(text, semitones) {
  // Regex menangkap tag [CHORD] beserta suku kata tepat di sebelahnya
  return text.replace(/\[([A-G][#b]?[^\]]*)\]([^\s\[]*)/g, (match, chord, textAfter) => {
    const transposed = transposeChord(chord, semitones);
    
    // Jika tidak ada kata setelah chord (misal di bagian Intro/Interlude)
    if (!textAfter) {
      return `<span class="chord-wrapper"><span class="chord">${transposed}</span></span>`;
    }

    // Tumpuk chord tepat di atas suku kata
    return `<span class="chord-wrapper"><span class="chord">${transposed}</span><span>${textAfter}</span></span>`;
  });
}

function updateRender() {
  const target = document.getElementById('chord-display');
  if (!target) return;
  target.innerHTML = parseChordPro(rawContent, currentTranspose);
  
  const valTag = document.getElementById('transpose-val');
  if (valTag) {
    valTag.innerText = (currentTranspose > 0 ? '+' : '') + currentTranspose;
  }
}

function changeKey(delta) {
  currentTranspose += delta;
  updateRender();
}

function initTransposer(content) {
  rawContent = content;
  updateRender();
}
