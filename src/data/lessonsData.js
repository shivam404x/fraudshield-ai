// Step-by-Step Touch Typing Curriculum
// Carefully structured from absolute beginner (F & J) to speed master & coder

export const LESSON_STAGES = [
  {
    id: 'stage-1',
    title: 'Stage 1: Home Row Foundation',
    subtitle: 'The starting position for all 10 fingers. Master these 8 keys first!',
    level: 'Beginner',
    lessons: [
      {
        id: '1-1',
        title: 'Lesson 1: The Anchor Keys (F & J)',
        description: 'Feel the small physical bumps on F and J! Place your left index on F and right index on J.',
        keys: ['f', 'j', ' '],
        text: 'f j f j ff jj f f j j fj jf f j fj jf fff jjj fjf jfj'
      },
      {
        id: '1-2',
        title: 'Lesson 2: Middle Fingers (D & K)',
        description: 'Left middle finger on D, right middle finger on K.',
        keys: ['d', 'k', 'f', 'j', ' '],
        text: 'd k d k dd kk dk kd f d j k fj dk kf jd ddk kkd fjd kdf'
      },
      {
        id: '1-3',
        title: 'Lesson 3: Ring Fingers (S & L)',
        description: 'Left ring finger on S, right ring finger on L.',
        keys: ['s', 'l', 'd', 'k', 'f', 'j', ' '],
        text: 's l s l ss ll sl ls as kl sk dl lsf ksd lls ssk fks ljd'
      },
      {
        id: '1-4',
        title: 'Lesson 4: Pinky Fingers (A & ;)',
        description: 'Left pinky on A, right pinky on semicolon (;).',
        keys: ['a', ';', 's', 'l', 'd', 'k', 'f', 'j', ' '],
        text: 'a ; a ; aa ;; a; ;a as df j; kl a;sldkfj fjdksla; a;sldkfj'
      },
      {
        id: '1-5',
        title: 'Lesson 5: Index Reaches (G & H)',
        description: 'Reach your left index to G, right index to H, then return to home row.',
        keys: ['g', 'h', 'f', 'j', 'd', 'k', 's', 'l', 'a', ';', ' '],
        text: 'g h g h fg jh gh hg fgh jhg glad hall dash flash half flask'
      },
      {
        id: '1-6',
        title: 'Lesson 6: Home Row Real Words',
        description: 'Combine all home row keys into real English words without looking at your keyboard!',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ' '],
        text: 'all ask dad fall glad hall flash salad dash half flask gas lad'
      }
    ]
  },
  {
    id: 'stage-2',
    title: 'Stage 2: Top Row Expansion',
    subtitle: 'Reach up from the home row to conquer the top letter row.',
    level: 'Intermediate',
    lessons: [
      {
        id: '2-1',
        title: 'Lesson 7: Vowels E & I',
        description: 'E and I are the most frequent vowels in English! Left middle on E, right middle on I.',
        keys: ['e', 'i', 'd', 'k', ' '],
        text: 'e i e i ee ii de ki ed ik kid see like side life ride die file'
      },
      {
        id: '2-2',
        title: 'Lesson 8: R & U Reaches',
        description: 'Left index reaches up to R, right index reaches up to U.',
        keys: ['r', 'u', 'f', 'j', ' '],
        text: 'r u r u rr uu fr ju rf uj fur run rule surf fire sure rush'
      },
      {
        id: '2-3',
        title: 'Lesson 9: W & O Keys',
        description: 'Left ring finger on W, right ring finger on O.',
        keys: ['w', 'o', 's', 'l', ' '],
        text: 'w o w o ww oo sw lo ow wo slow wood work word flow show row'
      },
      {
        id: '2-4',
        title: 'Lesson 10: T & Y Keys',
        description: 'Stretch left index to T, right index to Y.',
        keys: ['t', 'y', 'f', 'j', 'g', 'h', ' '],
        text: 't y t y tt yy ft jy tf yj they you that city try stay year'
      },
      {
        id: '2-5',
        title: 'Lesson 11: Top Row Full Sentences',
        description: 'Type complete English sentences combining Home and Top rows.',
        keys: ['all top and home'],
        text: 'the red kite flew high in the blue sky while we walked there'
      }
    ]
  },
  {
    id: 'stage-3',
    title: 'Stage 3: Bottom Row Mastery',
    subtitle: 'Reach down gently from the home row to complete the alphabet.',
    level: 'Advanced',
    lessons: [
      {
        id: '3-1',
        title: 'Lesson 12: V & M Keys',
        description: 'Left index reaches down to V, right index reaches down to M.',
        keys: ['v', 'm', 'f', 'j', ' '],
        text: 'v m v m vv mm fv jm vf mj move view make much very dream vim'
      },
      {
        id: '3-2',
        title: 'Lesson 13: C & Comma (,)',
        description: 'Left middle reaches down to C, right middle reaches down to comma.',
        keys: ['c', ',', 'd', 'k', ' '],
        text: 'c , c , cc ,, dc k, cd ,k call come cool code, nice, clear'
      },
      {
        id: '3-3',
        title: 'Lesson 14: X & Period (.)',
        description: 'Left ring reaches down to X, right ring reaches down to period (.).',
        keys: ['x', '.', 's', 'l', ' '],
        text: 'x . x . xx .. sx l. next fix text box. life is fast. be calm.'
      },
      {
        id: '3-4',
        title: 'Lesson 15: The Full Pangram Test',
        description: 'A sentence that contains every single letter from A to Z!',
        keys: ['a-z'],
        text: 'the quick brown fox jumps over the lazy dog and runs away'
      }
    ]
  },
  {
    id: 'stage-4',
    title: 'Stage 4: Speed & Flow (Monkeytype Mode)',
    subtitle: 'Fluid typing on the most common English words and famous quotes.',
    level: 'Speed Pro',
    lessons: [
      {
        id: '4-1',
        title: 'Top 50 Common Words',
        description: 'These 50 words make up over 40% of all written English!',
        keys: ['common words'],
        text: 'the be to of and a in that have i it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me'
      },
      {
        id: '4-2',
        title: 'Inspiring Wisdom',
        description: 'Famous quotes to practice pacing, rhythm, and accuracy.',
        keys: ['quotes'],
        text: 'success is not final failure is not fatal it is the courage to continue that counts in the middle of difficulty lies great opportunity'
      },
      {
        id: '4-3',
        title: 'Speed Sprint 60s',
        description: 'Test your pure Words-Per-Minute limit!',
        keys: ['speed'],
        text: 'focus on accuracy first because speed comes naturally when your fingers remember where each key lives keep your eyes on the screen and never look down at your hands'
      }
    ]
  },
  {
    id: 'stage-5',
    title: 'Stage 5: Programmer Mode (Code Typing)',
    subtitle: 'Practice syntax, braces, camelCase, and symbols used by software developers.',
    level: 'Coders',
    lessons: [
      {
        id: '5-1',
        title: 'JavaScript Essentials',
        description: 'Braces, arrows, and console statements.',
        keys: ['code'],
        text: 'const calculateSpeed = (words, time) => { return Math.round(words / time); };'
      },
      {
        id: '5-2',
        title: 'Python Essentials',
        description: 'Def, colons, lists, and indents.',
        keys: ['code'],
        text: 'def get_fastest_typist(scores): return sorted(scores, key=lambda x: x["wpm"], reverse=True)'
      },
      {
        id: '5-3',
        title: 'HTML & CSS Tags',
        description: 'Tags, angle brackets, and attributes.',
        keys: ['code'],
        text: '<div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl">'
      }
    ]
  }
];
