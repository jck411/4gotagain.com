// Word lists for human-memorable passwords
export const WORD_LISTS = {
    adjectives: [
        'bright', 'swift', 'brave', 'calm', 'clever', 'eager', 'fair', 'gentle', 'happy', 'kind',
        'lively', 'noble', 'proud', 'quick', 'royal', 'smart', 'tough', 'wise', 'young', 'bold',
        'clean', 'cool', 'crisp', 'deep', 'dry', 'fresh', 'grand', 'great', 'hot', 'icy',
        'large', 'light', 'long', 'loud', 'new', 'old', 'plain', 'rich', 'round', 'sharp',
        'short', 'silent', 'simple', 'smooth', 'soft', 'solid', 'strong', 'sweet', 'tall', 'thick',
        'thin', 'warm', 'wild', 'wooden', 'yellow', 'purple', 'green', 'blue', 'red', 'orange',
        'ancient', 'brilliant', 'curious', 'daring', 'elegant', 'fearless', 'glorious', 'graceful', 'harmonious', 'jovial',
        'legendary', 'luminous', 'majestic', 'mystical', 'mysterious', 'nimble', 'playful', 'radiant', 'resilient', 'spirited',
        'splendid', 'steadfast', 'sturdy', 'tranquil', 'vibrant', 'victorious', 'whimsical', 'wondrous', 'adventurous', 'courageous',
        'colorful', 'delightful', 'energetic', 'fascinating', 'imaginative', 'inventive', 'merry', 'peaceful', 'powerful', 'remarkable',
        'spectacular', 'sparkling', 'shimmering', 'glittering', 'precious', 'priceless', 'mighty', 'notable', 'stellar', 'timeless',
        'unbelievable', 'unforgettable', 'unmistakable', 'irresistible', 'incomparable', 'indestructive', 'impenetrable', 'multicolored',
        'extraordinary', 'revolutionary', 'independent', 'everlasting', 'indomitable', 'inspirational', 'magnificent', 'astonishing',
        'substantial', 'resourceful', 'thunderous'
    ],

    nouns: {
        animals: [
            'eagle', 'tiger', 'lion', 'wolf', 'bear', 'fox', 'hawk', 'owl', 'deer', 'whale',
            'shark', 'dolphin', 'dragon', 'phoenix', 'unicorn', 'butterfly', 'bee', 'ant', 'spider', 'snake',
            'horse', 'cat', 'dog', 'mouse', 'rabbit', 'elephant', 'giraffe', 'zebra', 'panda', 'koala',
            'penguin', 'seal', 'otter', 'dove', 'sparrow', 'raven', 'swan', 'falcon', 'lynx', 'leopard',
            'alligator', 'anteater', 'antelope', 'armadillo', 'badger', 'bison', 'buffalo', 'camel', 'chameleon', 'cheetah',
            'chimpanzee', 'chipmunk', 'cougar', 'coyote', 'crocodile', 'dingo', 'ferret', 'flamingo', 'gazelle', 'gorilla',
            'hamster', 'hedgehog', 'iguana', 'jackal', 'kangaroo', 'lemur', 'lizard', 'manatee', 'mongoose', 'moose',
            'octopus', 'opossum', 'orangutan', 'panther', 'parrot', 'pelican', 'porcupine', 'raccoon', 'rhinoceros', 'sloth',
            'squid', 'turtle', 'walrus', 'warthog', 'weasel', 'yak', 'zebu', 'woodpecker', 'hummingbird', 'seahorse',
            'salamander', 'grasshopper', 'ladybug', 'firefly', 'chinchilla', 'porpoise', 'starfish', 'hippopotamus',
            'caterpillar', 'caterpillars', 'rattlesnake', 'dragonfly', 'dragonflies', 'butterflies', 'jackrabbit', 'wildebeest'
        ],

        nature: [
            'mountain', 'river', 'forest', 'ocean', 'desert', 'valley', 'canyon', 'meadow', 'prairie', 'island',
            'waterfall', 'cave', 'cliff', 'beach', 'shore', 'lagoon', 'spring', 'lake', 'pond', 'stream',
            'sunset', 'sunrise', 'thunder', 'lightning', 'rainbow', 'storm', 'breeze', 'wind', 'cloud', 'star',
            'moon', 'comet', 'asteroid', 'galaxy', 'planet', 'satellite', 'meteor', 'nebula', 'cosmos', 'universe',
            'volcano', 'glacier', 'tundra', 'savanna', 'swamp', 'marsh', 'delta', 'estuary', 'archipelago', 'rainforest',
            'woodland', 'grassland', 'hillside', 'riverbank', 'waterway', 'geyser', 'grotto', 'fjord', 'plateau', 'monsoon',
            'cyclone', 'hurricane', 'tornado', 'earthquake', 'avalanche', 'blizzard', 'sandstorm', 'thunderstorm', 'hailstorm', 'aurora',
            'starlight', 'moonrise', 'sunlight', 'horizon', 'atmosphere', 'constellation', 'equinox', 'solstice', 'milkyway', 'rainfall',
            'afterglow', 'watershed', 'headwater', 'wildflower', 'snowdrift', 'whirlpool', 'riverbend', 'cavern', 'reef', 'tidalwave',
            'mountainside', 'thundercloud', 'groundwater', 'watercourse', 'headwaters', 'moonlight', 'sunbeam', 'rainshadow', 'snowmelt'
        ],

        objects: [
            // Gems & Metals
            'crystal', 'diamond', 'emerald', 'ruby', 'sapphire', 'pearl', 'gold', 'silver', 'iron', 'steel',
            'copper', 'bronze', 'platinum', 'titanium', 'cobalt', 'nickel', 'brass', 'chrome', 'jade', 'opal',
            'topaz', 'garnet', 'onyx', 'quartz', 'amber', 'coral', 'marble', 'granite', 'obsidian', 'turquoise',
            // Buildings & Structures
            'mirror', 'window', 'door', 'gate', 'bridge', 'tower', 'castle', 'temple', 'shrine', 'altar',
            'palace', 'fortress', 'mansion', 'cabin', 'cottage', 'vault', 'dome', 'arch', 'pillar', 'column',
            'wall', 'fence', 'rail', 'stair', 'ladder', 'ramp', 'tunnel', 'bunker', 'barn', 'mill',
            // Weapons & Armor
            'crown', 'sword', 'shield', 'armor', 'helmet', 'boots', 'cloak', 'ring', 'amulet', 'talisman',
            'dagger', 'spear', 'lance', 'mace', 'axe', 'bow', 'arrow', 'blade', 'hilt', 'sheath',
            'gauntlet', 'greave', 'breastplate', 'chainmail', 'buckler', 'quiver', 'crossbow', 'staff', 'wand', 'orb',
            // Books & Documents
            'book', 'scroll', 'map', 'compass', 'anchor', 'ship', 'boat', 'carriage', 'rocket', 'machine',
            'letter', 'journal', 'diary', 'ledger', 'chart', 'blueprint', 'sketch', 'canvas', 'portrait', 'statue',
            // Containers & Tools
            'chest', 'box', 'crate', 'barrel', 'jar', 'vase', 'pot', 'pan', 'kettle', 'cup',
            'bowl', 'plate', 'tray', 'basket', 'sack', 'pouch', 'purse', 'wallet', 'case', 'trunk',
            'hammer', 'nail', 'screw', 'bolt', 'wrench', 'plier', 'saw', 'drill', 'file', 'chisel',
            // Furniture & Household
            'chair', 'table', 'desk', 'bench', 'stool', 'couch', 'bed', 'shelf', 'drawer', 'cabinet',
            'lamp', 'candle', 'torch', 'lantern', 'clock', 'bell', 'horn', 'drum', 'flute', 'harp',
            'carpet', 'curtain', 'pillow', 'blanket', 'quilt', 'towel', 'rug', 'mat', 'frame', 'veil',
            // Vehicles & Transport
            'wheel', 'cart', 'wagon', 'sled', 'raft', 'canoe', 'yacht', 'barge', 'ferry', 'train',
            'plane', 'bike', 'scooter', 'skateboard', 'surfboard', 'kayak', 'glider', 'balloon', 'parachute', 'drone',
            // Misc Objects
            'coin', 'medal', 'trophy', 'badge', 'seal', 'stamp', 'token', 'charm', 'pendant', 'brooch',
            'needle', 'thread', 'ribbon', 'lace', 'bead', 'button', 'zipper', 'buckle', 'clasp', 'hook',
            'key', 'lock', 'chain', 'rope', 'wire', 'cable', 'pipe', 'tube', 'hose', 'valve',
            // Tools & Devices
            'battery', 'charger', 'tablet', 'laptop', 'notebook', 'camera', 'tripod', 'microphone', 'speaker', 'headphones',
            'backpack', 'suitcase', 'umbrella', 'flashlight', 'thermometer', 'stopwatch', 'calculator', 'keyboard', 'monitor', 'printer',
            'scanner', 'router', 'modem', 'typewriter', 'projector', 'binoculars', 'telescope', 'microscope', 'sundial', 'hourglass',
            'guitar', 'violin', 'trumpet', 'clarinet', 'saxophone', 'harmonica', 'puzzle', 'gameboard', 'joystick', 'controller',
            'refrigerator', 'kaleidoscope', 'screwdriver', 'thermostat', 'toothbrush', 'dishwasher', 'microwave', 'flashdrive',
            'headlamp', 'snowglobe', 'lawnmower', 'stethoscope', 'workbench', 'snowboard', 'windmill', 'sunglasses',
            'waterbottle', 'rollercoaster', 'paperweight', 'whiteboard', 'lighthouse', 'snowmobile', 'windsurfer', 'windshield',
            'handkerchief', 'television'
        ],

        colors: [
            'scarlet', 'crimson', 'vermilion', 'ruby', 'burgundy', 'maroon', 'amber', 'golden', 'bronze', 'copper',
            'emerald', 'jade', 'forest', 'sage', 'mint', 'olive', 'teal', 'turquoise', 'cyan', 'azure',
            'sapphire', 'cobalt', 'indigo', 'violet', 'lavender', 'magenta', 'fuchsia', 'rose', 'pink', 'peach',
            'ivory', 'cream', 'beige', 'tan', 'khaki', 'charcoal', 'slate', 'pewter', 'platinum', 'pearl',
            'cerulean', 'aquamarine', 'periwinkle', 'chartreuse', 'ultramarine', 'amethyst', 'sienna', 'sepia', 'umber', 'ochre',
            'lilac', 'plum', 'mauve', 'salmon', 'mustard', 'celadon', 'taupe', 'russet', 'mulberry', 'verdigris',
            'yellowgreen', 'springgreen', 'lightyellow', 'midnightblue', 'darkmagenta', 'lightcoral', 'darkslate', 'paleturquoise'
        ]
    },

    verbs: [
        'run', 'jump', 'fly', 'swim', 'climb', 'dance', 'sing', 'laugh', 'smile', 'dream',
        'hope', 'believe', 'create', 'build', 'forge', 'craft', 'shape', 'form', 'mold', 'bend',
        'break', 'heal', 'protect', 'guard', 'watch', 'search', 'find', 'discover', 'explore',
        'travel', 'journey', 'venture', 'wander', 'roam', 'hunt', 'chase', 'follow', 'lead', 'guide',
        'admire', 'arrange', 'assemble', 'balance', 'capture', 'collect', 'compose', 'conquer', 'consider', 'construct',
        'deliver', 'design', 'echo', 'elevate', 'embrace', 'enjoy', 'examine', 'express', 'gather', 'glimmer',
        'honor', 'imagine', 'inspire', 'listen', 'navigate', 'observe', 'perform', 'rescue', 'restore', 'scatter',
        'signal', 'sketch', 'spark', 'stretch', 'study', 'transform', 'whisper', 'whistle', 'wonder', 'whirl',
        'calculate', 'communicate', 'organize', 'remember', 'celebrate', 'refresh', 'shimmer', 'support', 'glisten', 'flourish',
        'accelerate', 'appreciate', 'contemplate', 'concentrate', 'coordinate', 'demonstrate', 'investigate', 'recalculate',
        'reconsider', 'rejuvenate', 'illustrate'
    ],

    numbers: [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
        'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million',
        'zero', 'dozen', 'score', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion'
    ]
};

// Rhyming word families for rhyming passwords
export const RHYME_FAMILIES = {
    ay: ['day', 'way', 'stay', 'play', 'say', 'ray', 'bay', 'gray', 'pay', 'may', 'clay', 'stray', 'sway', 'spray', 'decay', 'delay', 'display', 'array', 'portray', 'relay', 'away', 'betray', 'convey', 'gateway', 'highway', 'runway', 'roadway', 'stairway', 'pathway', 'halfway', 'holiday', 'yesterday'],
    ight: ['light', 'night', 'bright', 'right', 'sight', 'flight', 'knight', 'might', 'fight', 'tight', 'white', 'slight', 'height', 'delight', 'ignite', 'unite', 'excite', 'polite', 'insight', 'moonlight', 'twilight', 'starlight', 'sunlight', 'flashlight', 'headlight', 'limelight', 'daylight', 'midnight', 'spotlight', 'streetlight', 'highlight', 'foresight', 'oversight'],
    ing: ['ring', 'king', 'sing', 'spring', 'wing', 'bring', 'swing', 'sting', 'string', 'fling', 'cling', 'thing', 'lightning', 'sterling', 'sparkling', 'dazzling', 'gleaming', 'streaming', 'dreaming', 'beaming', 'morning', 'evening', 'rising', 'falling', 'rushing', 'roaming', 'wandering', 'whispering', 'thundering', 'glimmering', 'shimmering', 'fluttering', 'scattering', 'gathering'],
    ow: ['flow', 'glow', 'show', 'snow', 'grow', 'throw', 'blow', 'slow', 'low', 'row', 'know', 'shadow', 'rainbow', 'window', 'meadow', 'arrow', 'hollow', 'follow', 'borrow', 'tomorrow', 'willow', 'pillow', 'elbow', 'sparrow', 'widow', 'mellow', 'yellow', 'furrow', 'sorrow', 'overflow', 'undertow', 'afterglow'],
    all: ['call', 'fall', 'tall', 'ball', 'wall', 'hall', 'small', 'mall', 'stall', 'thrall', 'recall', 'install', 'waterfall', 'crystal', 'metal', 'petal', 'portal', 'mortal', 'coastal', 'royal', 'overall', 'downfall', 'snowfall', 'landfall', 'pitfall', 'eyeball', 'fastball', 'baseball', 'handball', 'firewall', 'windfall', 'pinball'],
    ake: ['lake', 'make', 'take', 'wake', 'shake', 'break', 'stake', 'drake', 'snake', 'flake', 'cake', 'bake', 'awake', 'mistake', 'earthquake', 'snowflake', 'overtake', 'undertake', 'partake', 'remake', 'cupcake', 'cheesecake', 'pancake', 'daybreak', 'heartbreak', 'jailbreak', 'outbreak', 'handshake', 'windbreak', 'milkshake'],
    ound: ['sound', 'ground', 'round', 'found', 'bound', 'pound', 'mound', 'hound', 'wound', 'surround', 'profound', 'compound', 'background', 'playground', 'underground', 'battleground', 'astound', 'resound', 'rebound', 'unbound', 'around', 'fairground', 'campground', 'turnaround', 'foreground', 'spellbound', 'northbound', 'southbound', 'eastbound', 'westbound', 'homebound', 'inbound', 'outbound'],
    ream: ['dream', 'stream', 'cream', 'team', 'beam', 'gleam', 'steam', 'scheme', 'theme', 'extreme', 'supreme', 'redeem', 'esteem', 'moonbeam', 'sunbeam', 'daydream', 'mainstream', 'downstream', 'upstream', 'iceream', 'icecream', 'jetstream', 'midstream', 'seam', 'deem', 'scream'],
    ire: ['fire', 'wire', 'hire', 'tire', 'spire', 'empire', 'inspire', 'desire', 'retire', 'admire', 'acquire', 'require', 'entire', 'attire', 'expire', 'vampire', 'sapphire', 'campfire', 'bonfire', 'wildfire', 'backfire', 'crossfire', 'gunfire', 'misfire', 'hellfire'],
    ace: ['space', 'place', 'race', 'face', 'grace', 'trace', 'chase', 'base', 'case', 'pace', 'embrace', 'replace', 'surface', 'palace', 'terrace', 'interface', 'fireplace', 'marketplace', 'starbase', 'moonbase', 'showcase', 'bookcase', 'staircase', 'suitcase', 'briefcase', 'outpace'],
    ine: ['shine', 'line', 'mine', 'pine', 'vine', 'fine', 'wine', 'sign', 'divine', 'combine', 'design', 'define', 'decline', 'refine', 'alpine', 'skyline', 'sunshine', 'moonshine', 'coastline', 'timeline', 'machine', 'magazine', 'routine', 'quarantine', 'caffeine', 'gasoline', 'limousine', 'tangerine', 'valentine', 'headline'],
    ower: ['power', 'tower', 'flower', 'hour', 'shower', 'devour', 'empower', 'superpower', 'sunflower', 'wildflower', 'watchtower', 'clocktower', 'firepower', 'manpower', 'willpower', 'horsepower', 'brainpower', 'starpower', 'bellflower', 'moonflower', 'mayflower', 'cornflower', 'sunshower', 'rainshower', 'darktower', 'overpower', 'flowerpower', 'windflower'],
    orm: ['storm', 'form', 'warm', 'swarm', 'charm', 'farm', 'harm', 'arm', 'alarm', 'transform', 'reform', 'perform', 'inform', 'conform', 'uniform', 'platform', 'brainstorm', 'thunderstorm', 'firestorm', 'snowstorm', 'sandstorm', 'windstorm', 'hailstorm', 'waveform', 'landform', 'earthworm'],
    aze: ['blaze', 'maze', 'haze', 'gaze', 'phase', 'craze', 'graze', 'praise', 'raise', 'amaze', 'ablaze', 'starbase', 'trailblaze', 'sunrays', 'always', 'sideways', 'pathways', 'doorways', 'highways', 'airways', 'daze', 'raze', 'glaze', 'stargaze', 'rephrase', 'appraise'],
    ain: ['rain', 'pain', 'gain', 'train', 'brain', 'chain', 'main', 'plain', 'strain', 'stain', 'drain', 'remain', 'explain', 'mountain', 'fountain', 'curtain'],
    ear: ['ear', 'near', 'clear', 'fear', 'gear', 'hear', 'cheer', 'steer', 'year', 'spear', 'rear', 'sheer', 'frontier', 'volunteer', 'engineer', 'pioneer', 'mountaineer'],
    ate: ['late', 'date', 'rate', 'gate', 'fate', 'state', 'plate', 'slate', 'create', 'rotate', 'translate', 'celebrate', 'decorate', 'activate', 'advocate', 'captivate', 'elaborate'],
    ice: ['ice', 'dice', 'nice', 'spice', 'price', 'slice', 'twice', 'advice', 'device', 'entice', 'precise', 'suffice', 'apprentice'],
    oon: ['moon', 'noon', 'spoon', 'loon', 'balloon', 'raccoon', 'cartoon', 'monsoon', 'lagoon', 'typhoon', 'maroon', 'harpoon', 'baboon'],
    est: ['best', 'rest', 'test', 'quest', 'chest', 'jest', 'crest', 'nest', 'west', 'request', 'digest', 'manifest', 'forest', 'harvest'],
    ack: ['back', 'black', 'stack', 'track', 'pack', 'snack', 'attack', 'crack', 'slack', 'tack', 'quack', 'hijack', 'feedback', 'backpack']
};

// Rhyming object families - objects that rhyme with each other
export const RHYMING_OBJECTS = {
    ade: [
        'blade', 'spade', 'shade', 'grenade', 'lemonade', 'marmalade', 'blockade', 'barricade', 'stockade', 'colonnade',
        'esplanade', 'promenade', 'arcade', 'cascade', 'facade'
    ],
    ail: [
        'rail', 'nail', 'mail', 'pail', 'sail', 'tail', 'flail', 'grail', 'handrail', 'guardrail',
        'cocktail', 'fingernail', 'thumbnail', 'coattail', 'ponytail'
    ],
    ake: [
        'cake', 'stake', 'flake', 'brake', 'rake', 'drake', 'snake', 'snowflake', 'keepsake', 'cupcake',
        'pancake', 'cheesecake', 'milkshake', 'earthquake', 'firebreak', 'mandrake'
    ],
    all: [
        'ball', 'wall', 'hall', 'mall', 'stall', 'snowball', 'cannonball', 'basketball', 'football', 'pinball',
        'paintball', 'fireball', 'handball', 'eyeball', 'fastball', 'waterfall'
    ],
    ane: [
        'cane', 'plane', 'crane', 'chain', 'pane', 'membrane', 'propane', 'windowpane', 'weathervane', 'monoplane',
        'airplane', 'biplane', 'seaplane'
    ],
    ar: [
        'car', 'bar', 'jar', 'star', 'guitar', 'cigar', 'radar', 'boxcar', 'streetcar', 'handlebar',
        'crowbar', 'sandbar', 'hangar', 'altar', 'calendar', 'minibar'
    ],
    ard: [
        'card', 'shard', 'board', 'placard', 'flashcard', 'scorecard', 'postcard', 'billboard', 'dashboard', 'clipboard',
        'hardboard', 'keycard'
    ],
    art: [
        'cart', 'dart', 'chart', 'tart', 'heart', 'smartcard', 'pushcart', 'flowchart', 'oxcart', 'gokart',
        'handcart', 'minecart'
    ],
    ase: [
        'case', 'vase', 'base', 'brace', 'briefcase', 'suitcase', 'staircase', 'bookcase', 'pillowcase', 'showcase',
        'toolcase', 'phonecase'
    ],
    ell: [
        'bell', 'shell', 'cell', 'well', 'spell', 'doorbell', 'dumbbell', 'eggshell', 'seashell', 'nutshell',
        'handbell', 'cowbell', 'inkwell'
    ],
    est: [
        'chest', 'nest', 'vest', 'crest', 'armrest', 'footrest', 'headrest', 'toolchest', 'backrest', 'wristrest',
        'legrest', 'birdnest'
    ],
    ock: [
        'clock', 'lock', 'block', 'dock', 'rock', 'padlock', 'deadlock', 'keylock', 'roadblock', 'cinderblock',
        'lockbox', 'bedrock', 'laptopdock'
    ],
    oil: [
        'coil', 'foil', 'tinfoil', 'airfoil', 'hydrofoil', 'motoroil', 'oliveoil', 'fishoil', 'snakeoil', 'castoroil',
        'seedoil', 'lampoil'
    ],
    old: [
        'gold', 'mold', 'fold', 'hold', 'scroll', 'scaffold', 'threshold', 'blindfold', 'stronghold', 'household',
        'foothold', 'gatefold'
    ],
    one: [
        'stone', 'bone', 'cone', 'throne', 'phone', 'gemstone', 'cobblestone', 'milestone', 'cornerstone', 'headstone',
        'tombstone', 'capstone', 'keystone', 'touchstone', 'sandstone', 'flagstone', 'moonstone', 'limestone',
        'lodestone', 'whetstone', 'soapstone', 'riverstone', 'grindstone', 'yellowstone', 'cobblestones', 'yellowstones'
    ],
    ool: [
        'pool', 'tool', 'stool', 'spool', 'school', 'footstool', 'handtool', 'powertool', 'gardentool', 'whirlpool',
        'carpool', 'swimmingpool'
    ],
    oom: [
        'room', 'loom', 'broom', 'bloom', 'plume', 'ballroom', 'bedroom', 'bathroom', 'showroom', 'mushroom',
        'stockroom', 'mailroom', 'classroom', 'cleanroom', 'darkroom', 'workroom'
    ],
    ord: [
        'cord', 'sword', 'board', 'keyboard', 'clipboard', 'dashboard', 'skateboard', 'surfboard', 'motherboard', 'switchboard',
        'cardboard', 'cupboard', 'chalkboard', 'whiteboard', 'scoreboard', 'soundboard', 'snowboard', 'dartboard',
        'headboard', 'backboard', 'floorboard', 'springboard', 'signboard', 'motherboards', 'switchboards'
    ],
    ore: [
        'door', 'store', 'core', 'floor', 'drawer', 'trapdoor', 'backdoor', 'outdoor', 'indoor', 'bookstore',
        'drugstore', 'seashore', 'hardwarestore'
    ],
    ow: [
        'bow', 'row', 'arrow', 'window', 'pillow', 'shadow', 'rainbow', 'crossbow', 'elbow', 'bungalow',
        'willow', 'snowplow', 'wheelbarrow', 'afterglow', 'meadow'
    ],
    rown: [
        'crown', 'gown', 'town', 'brown', 'frown', 'nightgown', 'sundown', 'countdown', 'breakdown', 'showdown',
        'downtown', 'uptown', 'brownstone', 'townhouse', 'rundown'
    ],
    ub: [
        'tub', 'club', 'hub', 'sub', 'shrub', 'bathtub', 'washtub', 'nightclub', 'flashbulb', 'lightbulb',
        'grub', 'scrub', 'stub', 'bulb', 'flowerbulb'
    ],
    urn: [
        'urn', 'churn', 'burn', 'turn', 'fern', 'lantern', 'cistern', 'cavern', 'tavern', 'pattern',
        'turnstile', 'curtain', 'saturn', 'stern', 'furnace'
    ]
};
