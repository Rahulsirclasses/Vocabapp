-- Seed initial vocabulary words for CAT/OMETS preparation
INSERT INTO vocab_words (word, meaning, synonyms, antonyms, example_sentence, difficulty_level)
VALUES
  (
    'Ephemeral',
    'Lasting for a very short time; transitory.',
    ARRAY['fleeting', 'transient', 'momentary', 'brief'],
    ARRAY['permanent', 'eternal', 'everlasting', 'enduring'],
    'The beauty of cherry blossoms is ephemeral, lasting only a few weeks each spring.',
    'hard'
  ),
  (
    'Ubiquitous',
    'Present, appearing, or found everywhere; omnipresent.',
    ARRAY['omnipresent', 'pervasive', 'universal', 'widespread'],
    ARRAY['rare', 'scarce', 'absent', 'limited'],
    'Smartphones have become ubiquitous in modern society, with nearly everyone owning one.',
    'medium'
  ),
  (
    'Pragmatic',
    'Dealing with things sensibly and realistically in a practical manner.',
    ARRAY['practical', 'realistic', 'sensible', 'down-to-earth'],
    ARRAY['idealistic', 'impractical', 'unrealistic', 'theoretical'],
    'The manager took a pragmatic approach to solving the budget crisis by cutting unnecessary expenses.',
    'medium'
  ),
  (
    'Ambiguous',
    'Open to more than one interpretation; having a double meaning.',
    ARRAY['unclear', 'vague', 'equivocal', 'cryptic'],
    ARRAY['clear', 'unambiguous', 'explicit', 'definite'],
    'The politician''s ambiguous statement left voters confused about her actual position on the issue.',
    'easy'
  ),
  (
    'Tenacious',
    'Holding firmly to something; persistent and determined.',
    ARRAY['persistent', 'determined', 'resolute', 'steadfast'],
    ARRAY['irresolute', 'weak', 'yielding', 'hesitant'],
    'Despite numerous rejections, the tenacious entrepreneur continued to pitch her innovative idea to investors.',
    'medium'
  )
ON CONFLICT (word) DO NOTHING;
