const fs = require('fs');
const path = require('path');

// Competitive Math
const compMath = {
  id: 'comp-math',
  name: 'Competitive Math',
  icon: '⚡',
  color: '#f59e0b',
  description: 'TMSCA, Number Sense, speed drills, mental math shortcuts',
  levels: {
    beginner: {
      name: 'Beginner',
      description: 'Basic arithmetic and speed drills',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `cm-b${i+1}`,
        type: 'text-input',
        question: i % 5 === 0 ? `What is 17 × 13?` : 
                  i % 5 === 1 ? `What is 23 + 47 + 19?` :
                  i % 5 === 2 ? `What is 144 ÷ 12?` :
                  i % 5 === 3 ? `What is 15²?` :
                  `What is 200 - 87?`,
        answer: i % 5 === 0 ? '221' :
                i % 5 === 1 ? '89' :
                i % 5 === 2 ? '12' :
                i % 5 === 3 ? '225' :
                '113',
        explanation: 'Practice mental math speed for Number Sense competitions.',
        xp: 10,
        timeLimit: 15
      }))
    },
    intermediate: {
      name: 'Intermediate',
      description: 'Multi-digit speed calculations',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `cm-i${i+1}`,
        type: 'text-input',
        question: i % 4 === 0 ? `What is 47 × 53?` :
                  i % 4 === 1 ? `What is √(1296)?` :
                  i % 4 === 2 ? `What is 2⁸?` :
                  `What is 35²?`,
        answer: i % 4 === 0 ? '2491' :
                i % 4 === 1 ? '36' :
                i % 4 === 2 ? '256' :
                '1225',
        explanation: i % 4 === 0 ? 'Use (50-3)(50+3) = 2500 - 9 = 2491' :
                     i % 4 === 1 ? 'Perfect square: 36 × 36 = 1296' :
                     i % 4 === 2 ? 'Powers of 2: double repeatedly' :
                     'Use (30+5)² = 900 + 300 + 25 = 1225',
        xp: 15,
        timeLimit: 20
      }))
    },
    advanced: {
      name: 'Advanced',
      description: 'Competition-level tricks and shortcuts',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `cm-a${i+1}`,
        type: 'text-input',
        question: i % 4 === 0 ? `What is 125 × 88?` :
                  i % 4 === 1 ? `What is 1/7 as decimal (first 6 digits)?` :
                  i % 4 === 2 ? `Find GCD(252, 198)` :
                  `What is 999²?`,
        answer: i % 4 === 0 ? '11000' :
                i % 4 === 1 ? '0.142857' :
                i % 4 === 2 ? '18' :
                '998001',
        explanation: i % 4 === 0 ? '125 × 88 = 125 × 8 × 11 = 1000 × 11' :
                     i % 4 === 1 ? '1/7 = 0.142857... (repeating)' :
                     i % 4 === 2 ? 'Use Euclidean algorithm' :
                     '999² = (1000-1)² = 1000000 - 2000 + 1 = 998001',
        xp: 20,
        timeLimit: 30
      }))
    }
  }
};

// STEM
const stem = {
  id: 'stem',
  name: 'STEM Foundations',
  icon: '🔬',
  color: '#10b981',
  description: 'Physics, engineering, chemistry, applied mathematics',
  levels: {
    beginner: {
      name: 'Beginner',
      description: 'Basic physics and engineering concepts',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `st-b${i+1}`,
        type: 'multiple-choice',
        question: i % 5 === 0 ? 'What is Newtons First Law?' :
                  i % 5 === 1 ? 'What is kinetic energy formula?' :
                  i % 5 === 2 ? 'What is Ohms Law?' :
                  i % 5 === 3 ? 'What is acceleration?' :
                  'What is potential energy?',
        options: i % 5 === 0 ? ['F=ma','Object in motion stays in motion unless acted upon by force','Every action has equal opposite reaction','Gravity'] :
                 i % 5 === 1 ? ['mgh','½mv²','mv','F×d'] :
                 i % 5 === 2 ? ['E=mc²','V=IR','P=IV','F=ma'] :
                 i % 5 === 3 ? ['Speed','Rate of change of velocity','Distance traveled','Force applied'] :
                 ['Energy of motion','Stored energy based on position (mgh for gravity)','Heat energy','Light energy'],
        correct: 1,
        explanation: i % 5 === 0 ? 'Law of inertia: objects resist changes in motion.' :
                     i % 5 === 1 ? 'KE = ½mv²: energy of motion.' :
                     i % 5 === 2 ? 'Ohms Law: voltage = current × resistance.' :
                     i % 5 === 3 ? 'Acceleration: how quickly velocity changes.' :
                     'Gravitational PE = mgh.',
        xp: 10
      }))
    },
    intermediate: {
      name: 'Intermediate',
      description: 'Thermodynamics, electromagnetism, waves',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `st-i${i+1}`,
        type: 'multiple-choice',
        question: i % 4 === 0 ? 'What is the First Law of Thermodynamics?' :
                  i % 4 === 1 ? 'What is Maxwells equations describe?' :
                  i % 4 === 2 ? 'What is entropy?' :
                  'What is Faradays Law?',
        options: i % 4 === 0 ? ['Entropy increases','Energy is conserved: ΔU = Q - W','Heat flows hot to cold','Absolute zero'] :
                 i % 4 === 1 ? ['Gravity','All classical electromagnetism','Quantum mechanics','Thermodynamics'] :
                 i % 4 === 2 ? ['Energy','Measure of disorder/randomness','Temperature','Pressure'] :
                 ['V=IR','Changing magnetic flux induces EMF','F=ma','E=mc²'],
        correct: 1,
        explanation: i % 4 === 0 ? 'ΔU = Q - W: energy conservation.' :
                     i % 4 === 1 ? 'Maxwells equations unify electricity and magnetism.' :
                     i % 4 === 2 ? 'Entropy: Second Law says it increases.' :
                     'Faraday: changing magnetic field induces electric field.',
        xp: 15
      }))
    },
    advanced: {
      name: 'Advanced',
      description: 'Quantum mechanics and advanced physics',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `st-a${i+1}`,
        type: 'multiple-choice',
        question: i % 5 === 0 ? 'What is the Schrödinger equation?' :
                  i % 5 === 1 ? 'What is the Heisenberg uncertainty principle?' :
                  i % 5 === 2 ? 'What is quantum superposition?' :
                  i % 5 === 3 ? 'What is quantum entanglement?' :
                  'What is the Pauli exclusion principle?',
        options: i % 5 === 0 ? ['Classical mechanics','Fundamental equation of quantum mechanics: iℏ∂ψ/∂t = Ĥψ','Relativity','Thermodynamics'] :
                 i % 5 === 1 ? ['Everything uncertain','Δx·Δp ≥ ℏ/2: cannot know position and momentum exactly','Measurement errors','Random motion'] :
                 i % 5 === 2 ? ['Adding forces','System exists in multiple states simultaneously until measured','Superposition','Stacking'] :
                 i % 5 === 3 ? ['Tangling','Correlated particles where measuring one affects other','Confusion','Complexity'] :
                 ['Exclusivity','No two fermions can occupy same quantum state','Repulsion','Separation'],
        correct: 1,
        explanation: i % 5 === 0 ? 'Schrödinger: describes quantum state evolution.' :
                     i % 5 === 1 ? 'Uncertainty: fundamental limit, not measurement error.' :
                     i % 5 === 2 ? 'Superposition: |ψ⟩ = α|0⟩ + β|1⟩.' :
                     i % 5 === 3 ? 'Entanglement: "spooky action at a distance".' :
                     'Pauli: explains atomic structure and periodic table.',
        xp: 20
      }))
    }
  }
};

fs.writeFileSync(path.join(__dirname, 'data', 'comp-math.json'), JSON.stringify(compMath, null, 2));
fs.writeFileSync(path.join(__dirname, 'data', 'stem.json'), JSON.stringify(stem, null, 2));

console.log('✅ Competitive Math created');
console.log('✅ STEM Foundations created');
