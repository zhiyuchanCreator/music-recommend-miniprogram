const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// P0 100张专辑种子数据
const DEFAULT_ALBUMS = 
  [
  {
    "_id": "album_15q71k",
    "title": "The Dark Side of the Moon",
    "artist": "Pink Floyd",
    "year": 1973,
    "genre": [
      "rock",
      "progressive rock"
    ],
    "rating": 99,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/f7/21/b3/f721b33f-c153-9c70-af05-c85306f4a4bc/dj.xynmkvxt.jpg/1000x1000bb.jpg",
    "description": "One of the best-selling albums of all time",
    "tracks": [
      "Speak to Me",
      "Breathe",
      "On the Run",
      "Time",
      "The Great Gig in the Sky",
      "Money",
      "Us and Them",
      "Any Colour You Like",
      "Brain Damage",
      "Eclipse"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.168Z",
      "cleanedAt": "2026-09-08T09:34:11.168Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_v9hli5",
    "title": "Kind of Blue",
    "artist": "Miles Davis",
    "year": 1959,
    "genre": [
      "jazz",
      "modal jazz"
    ],
    "rating": 98,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/7f/9f/d6/mzi.vtnaewef.jpg/1000x1000bb.jpg",
    "description": "The best-selling jazz record of all time",
    "tracks": [
      "So What",
      "Freddie Freeloader",
      "Blue in Green",
      "All Blues",
      "Flamenco Sketches"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_fbguoz",
    "title": "Abbey Road",
    "artist": "The Beatles",
    "year": 1969,
    "genre": [
      "rock",
      "pop"
    ],
    "rating": 97,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/df/db/61/dfdb615d-47f8-06e9-9533-b96daccc029f/18UMGIM31076.rgb.jpg/1000x1000bb.jpg",
    "description": "The Beatles' final masterpiece",
    "tracks": [
      "Come Together",
      "Something",
      "Maxwell's Silver Hammer",
      "Oh! Darling",
      "Octopus's Garden",
      "I Want You (She's So Heavy)",
      "Here Comes the Sun",
      "Because",
      "You Never Give Me Your Money",
      "Golden Slumbers",
      "Carry That Weight",
      "The End"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_uy91g3",
    "title": "OK Computer",
    "artist": "Radiohead",
    "year": 1997,
    "genre": [
      "alternative rock",
      "art rock"
    ],
    "rating": 96,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/1000x1000bb.jpg",
    "description": "A landmark album of the 90s",
    "tracks": [
      "Airbag",
      "Paranoid Android",
      "Subterranean Homesick Alien",
      "Exit Music (For a Film)",
      "Let Down",
      "Karma Police",
      "Fitter Happier",
      "Electioneering",
      "Climbing Up the Walls",
      "No Surprises",
      "Lucky",
      "The Tourist"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_dl4j26",
    "title": "Illmatic",
    "artist": "Nas",
    "year": 1994,
    "genre": [
      "hip hop",
      "east coast hip hop"
    ],
    "rating": 95,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b9/eb/cc/b9ebccbc-5ba4-2cdb-5332-b065739abd9a/886444567619.jpg/1000x1000bb.jpg",
    "description": "One of the greatest hip hop albums ever",
    "tracks": [
      "The Genesis",
      "N.Y. State of Mind",
      "Life's a Bitch",
      "The World Is Yours",
      "Halftime",
      "Memory Lane (Sittin' in da Park)",
      "One Love",
      "One Time 4 Your Mind",
      "Represent",
      "It Ain't Hard to Tell"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_vdvpqn",
    "title": "Loveless",
    "artist": "My Bloody Valentine",
    "year": 1991,
    "genre": [
      "shoegaze",
      "noise pop"
    ],
    "rating": 94,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/11/28/55/11285576-5ef0-9b0b-528b-e891e2260f5f/artwork.jpg/1000x1000bb.jpg",
    "description": "The definitive shoegaze album",
    "tracks": [
      "Only Shallow",
      "Loomer",
      "Touched",
      "To Here Knows When",
      "When You Sleep",
      "I Only Said",
      "Come in Alone",
      "Sometimes",
      "Blown a Wish",
      "What You Want",
      "Soon"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_96pcl0",
    "title": "Madvillainy",
    "artist": "Madvillain",
    "year": 2004,
    "genre": [
      "hip hop",
      "alternative hip hop"
    ],
    "rating": 93,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/18/b4/9a/18b49ad5-6407-7169-27f4-d1c8bcb5504b/s05.nqwebndj.jpg/1000x1000bb.jpg",
    "description": "MF DOOM and Madlib's masterpiece",
    "tracks": [
      "The Illest Villains",
      "Accordion",
      "Meat Grinder",
      "Bistro",
      "Raid",
      "America's Most Blunted",
      "Sickfit",
      "Rainbows",
      "Curls",
      "Do Not Fire!",
      "Shadows of Tomorrow"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_a2feo2",
    "title": "In the Aeroplane Over the Sea",
    "artist": "Neutral Milk Hotel",
    "year": 1998,
    "genre": [
      "indie rock",
      "folk"
    ],
    "rating": 92,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/12/e3/5c/12e35c39-de5c-b501-3ef0-00f19fb3d513/56627.jpg/1000x1000bb.jpg",
    "description": "A cult classic of indie rock",
    "tracks": [
      "King of Carrot Flowers Pt. One",
      "King of Carrot Flowers Pts. Two & Three",
      "In the Aeroplane Over the Sea",
      "Two-Headed Boy",
      "The Fool",
      "Holland, 1945",
      "Communist Daughter",
      "Oh Comely",
      "Ghost",
      "Untitled",
      "Two-Headed Boy Pt. Two"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_4tgbpc",
    "title": "To Pimp a Butterfly",
    "artist": "Kendrick Lamar",
    "year": 2015,
    "genre": [
      "hip hop",
      "jazz rap"
    ],
    "rating": 91,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b5/a6/91/b5a69171-5232-3d5b-9c15-8963802f83dd/15UMGIM15814.rgb.jpg/1000x1000bb.jpg",
    "description": "A modern hip hop masterpiece",
    "tracks": [
      "Wesley's Theory",
      "For Free?",
      "King Kunta",
      "Institutionalized",
      "These Walls",
      "u",
      "Alright",
      "For Sale?",
      "Momma",
      "Hood Politics",
      "How Much a Dollar Cost",
      "Complexion (A Zulu Love)",
      "The Blacker the Berry",
      "You Ain't Gotta Lie",
      "i",
      "Mortal Man"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_1o5wv3",
    "title": "Pet Sounds",
    "artist": "The Beach Boys",
    "year": 1966,
    "genre": [
      "pop",
      "baroque pop"
    ],
    "rating": 90,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/35/bb/c4/35bbc4eb-9387-97b0-b138-64b7a949ea43/13UABIM03512.rgb.jpg/1000x1000bb.jpg",
    "description": "Brian Wilson's pop symphony",
    "tracks": [
      "Wouldn't It Be Nice",
      "You Still Believe in Me",
      "That's Not Me",
      "Don't Talk (Put Your Head on My Shoulder)",
      "I'm Waiting for the Day",
      "Let's Go Away for Awhile",
      "Sloop John B",
      "God Only Knows",
      "I Know There's an Answer",
      "Here Today",
      "I Just Wasn't Made for These Times",
      "Pet Sounds",
      "Caroline, No"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_nw8hiz",
    "title": "Revolver",
    "artist": "The Beatles",
    "year": 1966,
    "genre": [
      "rock",
      "psychedelic rock"
    ],
    "rating": 89,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/58/4a/10/584a1058-de0a-6a6b-d0bd-da09a028b8bc/00602567705499.rgb.jpg/1000x1000bb.jpg",
    "description": "The Beatles' most innovative album",
    "tracks": [
      "Taxman",
      "Eleanor Rigby",
      "I'm Only Sleeping",
      "Love You To",
      "Here, There and Everywhere",
      "Yellow Submarine",
      "She Said She Said",
      "Good Day Sunshine",
      "And Your Bird Can Sing",
      "For No One",
      "Doctor Robert",
      "I Want to Tell You",
      "Got to Get You into My Life",
      "Tomorrow Never Knows"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_j0moxz",
    "title": "Highway 61 Revisited",
    "artist": "Bob Dylan",
    "year": 1965,
    "genre": [
      "folk rock",
      "blues rock"
    ],
    "rating": 88,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f8/ff/c0/f8ffc056-55b4-2033-657d-32492d1eea25/827969239926.jpg/1000x1000bb.jpg",
    "description": "Dylan's electric masterpiece",
    "tracks": [
      "Like a Rolling Stone",
      "Tombstone Blues",
      "It Takes a Lot to Laugh",
      "From a Buick 6",
      "Ballad of a Thin Man",
      "Queen Jane Approximately",
      "Highway 61 Revisited",
      "Just Like Tom Thumb's Blues",
      "Desolation Row"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_nw9bpx",
    "title": "Thriller",
    "artist": "Michael Jackson",
    "year": 1982,
    "genre": [
      "pop",
      "r&b"
    ],
    "rating": 87,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/32/4f/fd/324ffda2-9e51-8f6a-0c2d-c6fd2b41ac55/074643811224.jpg/1000x1000bb.jpg",
    "description": "The best-selling album of all time",
    "tracks": [
      "Wanna Be Startin' Somethin'",
      "Baby Be Mine",
      "The Girl Is Mine",
      "Thriller",
      "Beat It",
      "Billie Jean",
      "Human Nature",
      "P.Y.T. (Pretty Young Thing)",
      "The Lady in My Life"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.169Z",
      "cleanedAt": "2026-09-08T09:34:11.169Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_86kls6",
    "title": "Nevermind",
    "artist": "Nirvana",
    "year": 1991,
    "genre": [
      "grunge",
      "alternative rock"
    ],
    "rating": 86,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/77/b7/5a/77b75a96-aa50-33e0-ee68-baa650e6ef9b/655035711614.jpg/1000x1000bb.jpg",
    "description": "The album that changed rock music",
    "tracks": [
      "Smells Like Teen Spirit",
      "In Bloom",
      "Come as You Are",
      "Breed",
      "Lithium",
      "Polly",
      "Territorial Pissings",
      "Drain You",
      "Lounge Act",
      "Stay Away",
      "On a Plain",
      "Something in the Way"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_4wkg45",
    "title": "Remain in Light",
    "artist": "Talking Heads",
    "year": 1980,
    "genre": [
      "new wave",
      "art pop"
    ],
    "rating": 85,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/87/5f/5b/mzi.zzquknhm.jpg/1000x1000bb.jpg",
    "description": "Afrobeat meets new wave",
    "tracks": [
      "Born Under Punches (The Heat Goes On)",
      "Crosseyed and Painless",
      "The Great Curve",
      "Once in a Lifetime",
      "Houses in Motion",
      "Seen and Not Seen",
      "Listening Wind",
      "The Overload"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_4h2ll0",
    "title": "The Rise and Fall of Ziggy Stardust",
    "artist": "David Bowie",
    "year": 1972,
    "genre": [
      "glam rock",
      "art rock"
    ],
    "rating": 84,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/5f/fa/56/5ffa56c2-ea1f-7a17-6bad-192ff9b6476d/825646124206.jpg/1000x1000bb.jpg",
    "description": "Bowie's alien rock opera",
    "tracks": [
      "Five Years",
      "Soul Love",
      "Moonage Daydream",
      "Starman",
      "It Ain't Easy",
      "Lady Stardust",
      "Star",
      "Hang On to Yourself",
      "Ziggy Stardust",
      "Suffragette City",
      "Rock 'n' Roll Suicide"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_jr416w",
    "title": "A Love Supreme",
    "artist": "John Coltrane",
    "year": 1965,
    "genre": [
      "jazz",
      "modal jazz"
    ],
    "rating": 83,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e5/24/aa/e524aacd-467b-66f3-8931-0fcd6750a4b9/08UMGIM07914.rgb.jpg/1000x1000bb.jpg",
    "description": "A spiritual jazz journey",
    "tracks": [
      "Part I: Acknowledgement",
      "Part II: Resolution",
      "Part III: Pursuance",
      "Part IV: Psalm"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_dos1ms",
    "title": "Unknown Pleasures",
    "artist": "Joy Division",
    "year": 1979,
    "genre": [
      "post-punk",
      "gothic rock"
    ],
    "rating": 82,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/13/90/c0/1390c072-4249-3739-7b3d-fd73ee4a5698/825646562831.jpg/1000x1000bb.jpg",
    "description": "The sound of post-punk despair",
    "tracks": [
      "Disorder",
      "Day of the Lords",
      "Candidate",
      "Insight",
      "New Dawn Fades",
      "She's Lost Control",
      "Shadowplay",
      "Wilderness",
      "Interzone",
      "I Remember Nothing"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_7kx81g",
    "title": "Purple Rain",
    "artist": "Prince",
    "year": 1984,
    "genre": [
      "pop",
      "funk"
    ],
    "rating": 81,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/00/17/f2/0017f24f-e580-b77a-71a8-1bc7b75881bf/603497822065.jpg/1000x1000bb.jpg",
    "description": "Prince's magnum opus",
    "tracks": [
      "Let's Go Crazy",
      "Take Me with U",
      "The Beautiful Ones",
      "Computer Blue",
      "Darling Nikki",
      "When Doves Cry",
      "I Would Die 4 U",
      "Baby I'm a Star",
      "Purple Rain"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_11fq36",
    "title": "Enter the Wu-Tang",
    "artist": "Wu-Tang Clan",
    "year": 1993,
    "genre": [
      "hip hop",
      "hardcore hip hop"
    ],
    "rating": 80,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8c/20/1f/8c201f03-7617-2d8b-3d8d-e0ba2d55041b/196872123784.jpg/1000x1000bb.jpg",
    "description": "Raw East Coast hip hop",
    "tracks": [
      "Bring da Ruckus",
      "Shame on a Nigga",
      "Clan in da Front",
      "Wu-Tang: 7th Chamber",
      "Can It Be All So Simple",
      "Da Mystery of Chessboxin'",
      "Method Man",
      "Protect Ya Neck",
      "Tearz"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_dmaa5",
    "title": "Sgt. Pepper's Lonely Hearts Club Band",
    "artist": "The Beatles",
    "year": 1967,
    "genre": [
      "rock",
      "psychedelic rock"
    ],
    "rating": 98,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/64/85/d2/6485d219-91ac-5481-2668-7eab1320436d/21UMGIM57007.rgb.jpg/1000x1000bb.jpg",
    "description": "A landmark in music history",
    "tracks": [
      "Sgt. Pepper's Lonely Hearts Club Band",
      "With a Little Help from My Friends",
      "Lucy in the Sky with Diamonds",
      "Getting Better",
      "Fixing a Hole",
      "She's Leaving Home",
      "Being for the Benefit of Mr. Kite!",
      "Within You Without You",
      "When I'm Sixty-Four",
      "Lovely Rita",
      "Good Morning Good Morning",
      "Sgt. Pepper's Lonely Hearts Club Band (Reprise)",
      "A Day in the Life"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_hewmoh",
    "title": "What's Going On",
    "artist": "Marvin Gaye",
    "year": 1971,
    "genre": [
      "soul",
      "r&b"
    ],
    "rating": 97,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/76/36/2d/76362d74-cb7a-8ef9-104e-cde1d858e9a9/20UMGIM95279.rgb.jpg/1000x1000bb.jpg",
    "description": "A concept album masterpiece",
    "tracks": [
      "What's Going On",
      "What's Happening Brother",
      "Flyin' High (In the Friendly Sky)",
      "Save the Children",
      "God Is Love",
      "Mercy Mercy Me (The Ecology)",
      "Right On",
      "Wholy Holy",
      "Inner City Blues (Make Me Wanna Holler)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_16s72a",
    "title": "Blood on the Tracks",
    "artist": "Bob Dylan",
    "year": 1975,
    "genre": [
      "folk rock",
      "singer-songwriter"
    ],
    "rating": 96,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/34/6e/4d/346e4d1c-c9ef-cf7f-96d9-aad97286febb/074643323529.jpg/1000x1000bb.jpg",
    "description": "Dylan's emotional masterpiece",
    "tracks": [
      "Tangled Up in Blue",
      "Simple Twist of Fate",
      "You're a Big Girl Now",
      "Idiot Wind",
      "You're Gonna Make Me Lonesome When You Go",
      "Meet Me in the Morning",
      "Lily, Rosemary and the Jack of Hearts",
      "If You See Her, Say Hello",
      "Shelter from the Storm",
      "Buckets of Rain"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_ukz9xo",
    "title": "The Velvet Underground & Nico",
    "artist": "The Velvet Underground",
    "year": 1967,
    "genre": [
      "art rock",
      "experimental"
    ],
    "rating": 95,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/92/93/39/9293397f-a707-237e-ec7e-0ca613a67e3c/06UMGIM04143.rgb.jpg/1000x1000bb.jpg",
    "description": "The album that started a thousand bands",
    "tracks": [
      "Sunday Morning",
      "I'm Waiting for the Man",
      "Femme Fatale",
      "Venus in Furs",
      "Run Run Run",
      "All Tomorrow's Parties",
      "Heroin",
      "There She Goes Again",
      "I'll Be Your Mirror",
      "The Black Angel's Death Song",
      "European Son"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_refuqz",
    "title": "London Calling",
    "artist": "The Clash",
    "year": 1979,
    "genre": [
      "punk",
      "new wave"
    ],
    "rating": 94,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/93/cb/20/93cb201b-154b-7b74-a10b-48fbef9b3281/888880348937.jpg/1000x1000bb.jpg",
    "description": "Punk rock's masterpiece",
    "tracks": [
      "London Calling",
      "Brand New Cadillac",
      "Jimmy Jazz",
      "Hateful",
      "Rudie Can't Fail",
      "Spanish Bombs",
      "The Right Profile",
      "Lost in the Supermarket",
      "Clampdown",
      "The Guns of Brixton",
      "Wrong 'Em Boyo",
      "Death or Glory",
      "Koka Kola",
      "The Card Cheat",
      "Lover's Rock",
      "Four Horsemen",
      "I'm Not Down",
      "Revolution Rock",
      "Train in Vain"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_ik7bo7",
    "title": "Blonde on Blonde",
    "artist": "Bob Dylan",
    "year": 1966,
    "genre": [
      "folk rock",
      "blues rock"
    ],
    "rating": 93,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/20/9d/bf/209dbf58-f698-7181-33de-0c29480beba0/074640084126.jpg/1000x1000bb.jpg",
    "description": "Dylan's rock trilogy conclusion",
    "tracks": [
      "Rainy Day Women #12 & 35",
      "Pledging My Time",
      "Visions of Johanna",
      "One of Us Must Know (Sooner or Later)",
      "I Want You",
      "Stuck Inside of Mobile with the Memphis Blues Again",
      "Leopard-Skin Pill-Box Hat",
      "Just Like a Woman",
      "Most Likely You Go Your Way (And I'll Go Mine)",
      "Temporary Like Achilles",
      "Absolutely Sweet Marie",
      "4th Time Around",
      "Obviously 5 Believers",
      "Sad Eyed Lady of the Lowlands"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_nxir0n",
    "title": "The Queen Is Dead",
    "artist": "The Smiths",
    "year": 1986,
    "genre": [
      "indie rock",
      "alternative rock"
    ],
    "rating": 92,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1a/e8/70/1ae870c3-b402-096b-c4c4-8022af5a2ed9/745099189662.jpg/1000x1000bb.jpg",
    "description": "The pinnacle of indie rock",
    "tracks": [
      "The Queen Is Dead",
      "Frankly, Mr. Shankly",
      "I Know It's Over",
      "Never Had No One Ever",
      "Cemetry Gates",
      "Bigmouth Strikes Again",
      "The Boy with the Thorn in His Side",
      "Vicar in a Tutu",
      "There Is a Light That Never Goes Out",
      "Some Girls Are Bigger Than Others"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_krpd5r",
    "title": "Blue",
    "artist": "Joni Mitchell",
    "year": 1971,
    "genre": [
      "folk",
      "singer-songwriter"
    ],
    "rating": 91,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/00/a2/43/00a24363-cf69-bfd2-a26a-a042d57ab141/075992719926.jpg/1000x1000bb.jpg",
    "description": "A confessional masterpiece",
    "tracks": [
      "All I Want",
      "My Old Man",
      "Little Green",
      "Carey",
      "Blue",
      "California",
      "This Flight Tonight",
      "River",
      "A Case of You",
      "The Last Time I Saw Richard"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_m70um8",
    "title": "Led Zeppelin IV",
    "artist": "Led Zeppelin",
    "year": 1971,
    "genre": [
      "hard rock",
      "folk rock"
    ],
    "rating": 90,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5c/15/9b/5c159b27-95ca-b9a7-84e3-28e795fffd39/dj.kvkrpptq.jpg/1000x1000bb.jpg",
    "description": "Contains Stairway to Heaven",
    "tracks": [
      "Black Dog",
      "Rock and Roll",
      "The Battle of Evermore",
      "Stairway to Heaven",
      "Misty Mountain Hop",
      "Four Sticks",
      "Going to California",
      "When the Levee Breaks"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_5pcgy8",
    "title": "It Takes a Nation of Millions to Hold Us Back",
    "artist": "Public Enemy",
    "year": 1988,
    "genre": [
      "hip hop",
      "political hip hop"
    ],
    "rating": 89,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/7/73/PublicEnemyItTakesaNationofMillionstoHoldUsBack.jpg",
    "description": "Revolutionary hip hop",
    "tracks": [
      "Countdown to Armageddon",
      "Bring the Noise",
      "Don't Believe the Hype",
      "Cold Lampin' with Flavor",
      "Terminator X to the Edge of Panic",
      "Mind Terrorist",
      "Louder Than a Bomb",
      "Caught, Can We Get a Witness?",
      "Show 'Em Whatcha Got",
      "She Watch Channel Zero?!",
      "Night of the Living Baseheads",
      "Black Steel in the Hour of Chaos",
      "Rebel Without a Pause",
      "Prophets of Rage"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_veh1pj",
    "title": "The Stone Roses",
    "artist": "The Stone Roses",
    "year": 1989,
    "genre": [
      "indie rock",
      "baggy"
    ],
    "rating": 88,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/de/bd/71/debd715a-d49b-1ec8-6b4d-bf3f25e0e90b/dj.rldpqukx.jpg/1000x1000bb.jpg",
    "description": "The birth of Madchester",
    "tracks": [
      "I Wanna Be Adored",
      "She Bangs the Drums",
      "Elephant Stone",
      "Waterfall",
      "Don't Stop",
      "Bye Bye Badman",
      "Sugar Spun Sister",
      "Made of Stone",
      "Shoot You Down",
      "This Is the One",
      "I Am the Resurrection",
      "Fools Gold"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_43w3y7",
    "title": "Disintegration",
    "artist": "The Cure",
    "year": 1989,
    "genre": [
      "gothic rock",
      "post-punk"
    ],
    "rating": 87,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/1000x1000bb.jpg",
    "description": "The Cure's gothic masterpiece",
    "tracks": [
      "Plainsong",
      "Pictures of You",
      "Closedown",
      "Lovesong",
      "Last Dance",
      "Lullaby",
      "Fascination Street",
      "Prayers for Rain",
      "The Same Deep Water as You",
      "Disintegration",
      "Homesick",
      "Untitled"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_i3zjp7",
    "title": "Doolittle",
    "artist": "Pixies",
    "year": 1989,
    "genre": [
      "alternative rock",
      "indie rock"
    ],
    "rating": 86,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/34/07/72/34077276-8f67-c638-8c4f-73dd89d2dfab/5014436905025.png/1000x1000bb.jpg",
    "description": "Influential alternative rock",
    "tracks": [
      "Debaser",
      "Tame",
      "Wave of Mutilation",
      "I Bleed",
      "Here Comes Your Man",
      "Dead",
      "Monkey Gone to Heaven",
      "Mr. Grieves",
      "Crackity Jones",
      "La La Love You",
      "No. 13 Baby",
      "There Goes My Gun",
      "Hey",
      "Silver",
      "Gouge Away"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_wp6716",
    "title": "Marquee Moon",
    "artist": "Television",
    "year": 1977,
    "genre": [
      "art punk",
      "post-punk"
    ],
    "rating": 85,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1b/6a/c1/1b6ac100-8d0e-ec9d-4639-88b11ed2cdad/603497886029.jpg/1000x1000bb.jpg",
    "description": "Guitar rock perfection",
    "tracks": [
      "See No Evil",
      "Venus",
      "Friction",
      "Marquee Moon",
      "Elevation",
      "Guiding Light",
      "Prove It",
      "Torn Curtain"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_88kpp0",
    "title": "Transformer",
    "artist": "Lou Reed",
    "year": 1972,
    "genre": [
      "glam rock",
      "art rock"
    ],
    "rating": 84,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2a/e7/69/2ae76967-b94e-3b80-a079-93202eeb6157/886445151930.jpg/1000x1000bb.jpg",
    "description": "Walk on the Wild Side",
    "tracks": [
      "Vicious",
      "Andy's Chest",
      "Perfect Day",
      "Hangin' Round",
      "Walk on the Wild Side",
      "Make Up",
      "Satellite of Love",
      "Wagon Wheel",
      "New York Telephone Conversation",
      "I'm So Free",
      "Goodnight Ladies"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_7wubzi",
    "title": "Harvest",
    "artist": "Neil Young",
    "year": 1972,
    "genre": [
      "folk rock",
      "country rock"
    ],
    "rating": 83,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e0/4b/c4/e04bc4e6-9d3a-0bab-c953-f139c72fd337/093624924722.jpg/1000x1000bb.jpg",
    "description": "Young's commercial peak",
    "tracks": [
      "Out on the Weekend",
      "Harvest",
      "A Man Needs a Maid",
      "Heart of Gold",
      "Are You Ready for the Country?",
      "Old Man",
      "There's a World",
      "Alabama",
      "The Needle and the Damage Done",
      "Words (Between the Lines of Age)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_2okbtk",
    "title": "Is This It",
    "artist": "The Strokes",
    "year": 2001,
    "genre": [
      "indie rock",
      "garage rock"
    ],
    "rating": 82,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/0/09/The_Strokes_-_Is_This_It.png",
    "description": "Revived garage rock in the 2000s",
    "tracks": [
      "Is This It",
      "The Modern Age",
      "Soma",
      "Barely Legal",
      "Someday",
      "Alone, Together",
      "Last Nite",
      "Hard to Explain",
      "When It Started",
      "Trying Your Luck",
      "Take It or Leave It"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_nail76",
    "title": "Bitches Brew",
    "artist": "Miles Davis",
    "year": 1970,
    "genre": [
      "jazz fusion",
      "experimental"
    ],
    "rating": 81,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9b/e1/63/9be1630c-486d-760c-76cf-04282174700a/074646577424.jpg/1000x1000bb.jpg",
    "description": "The birth of jazz fusion",
    "tracks": [
      "Pharaoh's Dance",
      "Bitches Brew",
      "Spanish Key",
      "John McLaughlin",
      "Miles Runs the Voodoo Down",
      "Sanctuary"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_sjtz7d",
    "title": "Spiderland",
    "artist": "Slint",
    "year": 1991,
    "genre": [
      "post-rock",
      "math rock"
    ],
    "rating": 80,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2d/62/b7/2d62b77d-9518-b5f1-7212-5542597953c2/cover.jpg/1000x1000bb.jpg",
    "description": "The blueprint for post-rock",
    "tracks": [
      "Breadcrumb Trail",
      "Nosferatu Man",
      "Don, Aman",
      "Washer",
      "For Dinner...",
      "Good Morning, Captain"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_1qcv2m",
    "title": "Daydream Nation",
    "artist": "Sonic Youth",
    "year": 1988,
    "genre": [
      "noise rock",
      "alternative rock"
    ],
    "rating": 79,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/9a/55/3b/9a553bab-12a5-a385-31b7-720087fa3130/818756010958_cover.jpg/1000x1000bb.jpg",
    "description": "Noise rock's finest hour",
    "tracks": [
      "Teen Age Riot",
      "Silver Rocket",
      "The Sprawl",
      "Cross the Breeze",
      "Eric's Trip",
      "Total Trash",
      "Hey Joni",
      "Providence",
      "Candle",
      "Rain King",
      "Kissability",
      "Trilogy: a) The Wonder",
      "Trilogy: b) Hyperstation",
      "Trilogy: z) Eliminator Jr."
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_zhx7zy",
    "title": "The Low End Theory",
    "artist": "A Tribe Called Quest",
    "year": 1991,
    "genre": [
      "hip hop",
      "jazz rap"
    ],
    "rating": 78,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/4/42/ATribeCalledQuestTheLowEndtheory.jpg",
    "description": "Jazz rap perfection",
    "tracks": [
      "Excursions",
      "Buggin' Out",
      "Rap Promoter",
      "Butter",
      "Verses from the Abstract",
      "Show Business",
      "Vibes and Stuff",
      "The Infamous Date Rape",
      "Check the Rhime",
      "Everything Is Fair",
      "Jazz (We've Got)",
      "Skypager",
      "What?",
      "Scenario"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_s1tq14",
    "title": "Horses",
    "artist": "Patti Smith",
    "year": 1975,
    "genre": [
      "punk rock",
      "art punk"
    ],
    "rating": 77,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0b/cd/a8/0bcda80a-0046-aa13-1416-71d844dfb711/886445500394.jpg/1000x1000bb.jpg",
    "description": "The birth of punk poetry",
    "tracks": [
      "Gloria",
      "Redondo Beach",
      "Birdland",
      "Free Money",
      "Kimberly",
      "Break It Up",
      "Land",
      "Elegie"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_g8pl01",
    "title": "Selected Ambient Works 85-92",
    "artist": "Aphex Twin",
    "year": 1992,
    "genre": [
      "ambient",
      "electronic"
    ],
    "rating": 76,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/1000x1000bb.jpg",
    "description": "Ambient electronica classic",
    "tracks": [
      "Xtal",
      "Tha",
      "Pulsewidth",
      "Ageispolis",
      "i",
      "Green Calx",
      "Heliosphan",
      "We Are the Music Makers",
      "Schottkey 7th Path",
      "Ptolemy",
      "Hedphelym",
      "Delphium",
      "Actium"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.170Z",
      "cleanedAt": "2026-09-08T09:34:11.170Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_z2aa6j",
    "title": "Grace",
    "artist": "Jeff Buckley",
    "year": 1994,
    "genre": [
      "alternative rock",
      "folk rock"
    ],
    "rating": 75,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/26/d6/e3/26d6e339-a7a9-d61e-1b5f-0852a5515a55/886445517880.jpg/1000x1000bb.jpg",
    "description": "A voice from the heavens",
    "tracks": [
      "Mojo Pin",
      "Grace",
      "Last Goodbye",
      "Lilac Wine",
      "So Real",
      "Hallelujah",
      "Lover, You Should've Come Over",
      "Corpus Christi Carol",
      "Eternal Life",
      "Dream Brother"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_w3dxnw",
    "title": "Electric Ladyland",
    "artist": "Jimi Hendrix",
    "year": 1968,
    "genre": [
      "psychedelic rock",
      "blues rock"
    ],
    "rating": 74,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/b8/45/a6b84589-6ff7-a462-9ff9-170b724980d5/dj.wjkdwlks.jpg/1000x1000bb.jpg",
    "description": "Hendrix at his peak",
    "tracks": [
      "And the Gods Made Love",
      "Have You Ever Been (To Electric Ladyland)",
      "Crosstown Traffic",
      "Voodoo Chile",
      "Little Miss Strange",
      "Long Hot Summer Night",
      "Come On (Let the Good Times Roll)",
      "Gypsy Eyes",
      "Burning of the Midnight Lamp",
      "Rainy Day, Dream Away",
      "1983... (A Merman I Should Turn to Be)",
      "Moon, Turn the Tides... Gently Gently Away",
      "Still Raining, Still Dreaming",
      "House Burning Down",
      "All Along the Watchtower",
      "Voodoo Child (Slight Return)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_wznp2q",
    "title": "Closer",
    "artist": "Joy Division",
    "year": 1980,
    "genre": [
      "post-punk",
      "gothic rock"
    ],
    "rating": 73,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features114/v4/d9/2a/d1/d92ad12e-cdf2-e567-9612-af2fdfa82237/dj.uzqznczn.jpg/1000x1000bb.jpg",
    "description": "A dark, haunting farewell",
    "tracks": [
      "Atrocity Exhibition",
      "Isolation",
      "Passover",
      "Colony",
      "A Means to an End",
      "Heart and Soul",
      "Twenty Four Hours",
      "The Eternal",
      "Decades"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_xmhgf2",
    "title": "Blue Lines",
    "artist": "Massive Attack",
    "year": 1991,
    "genre": [
      "trip hop",
      "electronic"
    ],
    "rating": 72,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e5/f7/c0/e5f7c07d-2182-e732-8ad6-be03814fe93c/13UABIM04453.rgb.jpg/1000x1000bb.jpg",
    "description": "The birth of trip hop",
    "tracks": [
      "Safe from Harm",
      "One Love",
      "Blue Lines",
      "Be Thankful for What You've Got",
      "Five Man Army",
      "Unfinished Sympathy",
      "Daydreaming",
      "Lately",
      "Hymn of the Big Wheel"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_fifppu",
    "title": "Rumours",
    "artist": "Fleetwood Mac",
    "year": 1977,
    "genre": [
      "pop rock",
      "soft rock"
    ],
    "rating": 71,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4d/13/ba/4d13bac3-d3d5-7581-2c74-034219eadf2b/081227970949.jpg/1000x1000bb.jpg",
    "description": "Breakup album perfection",
    "tracks": [
      "Second Hand News",
      "Dreams",
      "Never Going Back Again",
      "Don't Stop",
      "Go Your Own Way",
      "Songbird",
      "The Chain",
      "You Make Loving Fun",
      "I Don't Want to Know",
      "Oh Daddy",
      "Gold Dust Woman"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_u7mtxg",
    "title": "Entertainment!",
    "artist": "Gang of Four",
    "year": 1979,
    "genre": [
      "post-punk",
      "funk"
    ],
    "rating": 70,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/86/8e/e9/868ee973-0caf-a663-9d4f-58ff57c104da/191401174275.png/1000x1000bb.jpg",
    "description": "Political post-punk",
    "tracks": [
      "Ether",
      "Natural's Not in It",
      "Not Great Men",
      "Damaged Goods",
      "Return the Gift",
      "Guns Before Butter",
      "I Found That Essence Rare",
      "To Hell With Poverty!",
      "Why Theory?",
      "Anthrax",
      "Mannequin",
      "Contract",
      "At Home He's a Tourist",
      "5.45",
      "Love Like Anthrax"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_zicy0k",
    "title": "Homogenic",
    "artist": "Bjork",
    "year": 1997,
    "genre": [
      "electronic",
      "art pop"
    ],
    "rating": 69,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/12/38/d0/1238d076-0a43-5758-1876-5ab6d256d648/5016958995157.png/1000x1000bb.jpg",
    "description": "Icelandic electronic perfection",
    "tracks": [
      "Hunter",
      "Jóga",
      "Unravel",
      "Bachelorette",
      "All Neon Like",
      "5 Years",
      "Immature",
      "Alarm Call",
      "Pluto",
      "All Is Full of Love"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_7yaav5",
    "title": "Exile on Main St.",
    "artist": "The Rolling Stones",
    "year": 1972,
    "genre": [
      "rock",
      "blues rock"
    ],
    "rating": 88,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/8/86/ExileMainSt.jpg",
    "description": "The Stones' sprawling double album masterpiece.",
    "tracks": [
      "Rocks Off",
      "Rip This Joint",
      "Shake Your Hips",
      "Casino Boogie",
      "Tumbling Dice",
      "Sweet Virginia",
      "Torn and Frayed",
      "Sweet Black Angel",
      "Loving Cup",
      "Happy",
      "Turd on the Run",
      "Ventilator Blues",
      "I Just Want to See His Face",
      "Let It Loose",
      "All Down the Line",
      "Stop Breaking Down",
      "Shine a Light",
      "Soul Survivor"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_1e3m23",
    "title": "Innervisions",
    "artist": "Stevie Wonder",
    "year": 1973,
    "genre": [
      "soul",
      "funk"
    ],
    "rating": 87,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ff/c2/5f/ffc25f04-cb3b-b56e-dd28-8b77ae63e613/00602537070824.rgb.jpg/1000x1000bb.jpg",
    "description": "Stevie Wonder's synth-driven soul masterpiece.",
    "tracks": [
      "Too High",
      "Visions",
      "Living For the City",
      "Golden Lady",
      "Higher Ground",
      "Jesus Children of America",
      "All In Love Is Fair",
      "Don't You Worry 'Bout a Thing",
      "He's Misstra Know-It-All"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_xbem9o",
    "title": "Songs in the Key of Life",
    "artist": "Stevie Wonder",
    "year": 1976,
    "genre": [
      "soul",
      "funk"
    ],
    "rating": 85,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/eb/1f/12/eb1f12ec-474c-63aa-43af-09282f423b9d/00602537004737.rgb.jpg/1000x1000bb.jpg",
    "description": "An expansive double album of pop, soul and jazz.",
    "tracks": [
      "Love's In Need of Love Today",
      "Isn't She Lovely",
      "Have a Talk With God",
      "Joy Inside My Tears",
      "Village Ghetto Land",
      "Black Man",
      "Contusion",
      "Ngiculela-Es Una Historia-I Am Singing",
      "Sir Duke",
      "If It's Magic",
      "I Wish",
      "As",
      "Knocks Me Off My Feet",
      "Another Star",
      "Pastime Paradise",
      "Saturn",
      "Summer Soft",
      "Ebony Eyes",
      "Ordinary Pain",
      "All Day Sucker",
      "Easy Goin' Evening (My Mama's Call)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_1eniz1",
    "title": "Talking Book",
    "artist": "Stevie Wonder",
    "year": 1972,
    "genre": [
      "soul",
      "funk"
    ],
    "rating": 86,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/62/61/61/626161c0-f4d7-e6ff-8586-768340ef278f/00602537002382.rgb.jpg/1000x1000bb.jpg",
    "description": "A landmark of 70s pop and soul.",
    "tracks": [
      "You Are the Sunshine of My Life",
      "Maybe Your Baby",
      "You and I",
      "Tuesday Heartbreak",
      "You've Got It Bad Girl",
      "Superstition",
      "Big Brother",
      "Blame It On the Sun",
      "Lookin' for Another Pure Love",
      "I Believe (When I Fall In Love It Will Be Forever)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_yj8r78",
    "title": "1999",
    "artist": "Prince",
    "year": 1982,
    "genre": [
      "funk",
      "pop"
    ],
    "rating": 84,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/9/9f/Prince1999.jpg",
    "description": "Prince's breakthrough double album.",
    "tracks": [
      "1999",
      "Little Red Corvette",
      "Delirious",
      "Let's Pretend We're Married",
      "D.M.S.R.",
      "Automatic",
      "Something in the Water (Does Not Compute)",
      "Free",
      "Lady Cab Driver",
      "All the Critics Love U in New York",
      "International Lover"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_1tjt82",
    "title": "Sign o' the Times",
    "artist": "Prince",
    "year": 1987,
    "genre": [
      "funk",
      "pop"
    ],
    "rating": 83,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a9/52/38/a95238ab-10f9-e407-4bc8-755148d32d65/886448874546.jpg/1000x1000bb.jpg",
    "description": "Prince's eclectic double album peak.",
    "tracks": [
      "Sign O' The Times (2020 Remaster)",
      "U Got The Look (2020 Remaster)",
      "Play In The Sunshine (2020 Remaster)",
      "If I Was Your Girlfriend (2020 Remaster)",
      "Housequake (2020 Remaster)",
      "Strange Relationship (2020 Remaster)",
      "The Ballad Of Dorothy Parker (2020 Remaster)",
      "I Could Never Take The Place Of Your Man (2020 Remaster)",
      "It (2020 Remaster)",
      "The Cross (2020 Remaster)",
      "Starfish And Coffee (2020 Remaster)",
      "It's Gonna Be A Beautiful Night (2020 Remaster)",
      "Slow Love (2020 Remaster)",
      "Adore (2020 Remaster)",
      "Hot Thing (2020 Remaster)",
      "Forever In My Life (2020 Remaster)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_3eepay",
    "title": "Red",
    "artist": "King Crimson",
    "year": 1974,
    "genre": [
      "progressive rock",
      "hard rock"
    ],
    "rating": 82,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music4/v4/a8/5d/d3/a85dd370-ed7e-1e6f-f2ee-5464f7b3a978/Red_2500px.jpg/1000x1000bb.jpg",
    "description": "Heavy, menacing progressive rock.",
    "tracks": [
      "Red",
      "Fallen Angel",
      "One More Red Nightmare",
      "Providence",
      "Starless",
      "Improv: A Voyage to the Centre of the Cosmos (Bonus Track)",
      "Improv: Providence (Full Version) [Bonus Track]",
      "Starless (Live In Central Park) [Bonus Track]"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_ms64jc",
    "title": "In the Court of the Crimson King",
    "artist": "King Crimson",
    "year": 1969,
    "genre": [
      "progressive rock",
      "art rock"
    ],
    "rating": 81,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music5/v4/2f/c7/19/2fc71988-6871-be2c-6731-a3d0f2a6b232/Court_2500px.jpg/1000x1000bb.jpg",
    "description": "The album that launched progressive rock.",
    "tracks": [
      "21st Century Schizoid Man (Including \"Mirrors\")",
      "I Talk to the Wind",
      "Epitaph (Including \"March for No Reason\" and \"Tomorrow and Tomorrow\")",
      "Moonchild (Including \"The Dream\" and \"The Illusion\")",
      "The Court of the Crimson King (Including \"The Return of the Fire Witch\" and \"The Dance of the Puppets\")",
      "21st Century Schizoid Man (Radio Version)",
      "I Talk to the Wind (Duo Version)",
      "A Man a City (Live at the Fillmore West)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_coqqht",
    "title": "Astral Weeks",
    "artist": "Van Morrison",
    "year": 1968,
    "genre": [
      "folk rock",
      "singer-songwriter"
    ],
    "rating": 80,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/88/91/1b/88911b7b-a63f-4624-3fb1-2976b628c59a/603497886340.jpg/1000x1000bb.jpg",
    "description": "A stream-of-consciousness folk-jazz masterpiece.",
    "tracks": [
      "Astral Weeks",
      "Beside You",
      "Sweet Thing",
      "Cyprus Avenue",
      "The Way Young Lovers Do",
      "Madame George",
      "Ballerina",
      "Slim Slow Slider"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_3uq8st",
    "title": "Moondance",
    "artist": "Van Morrison",
    "year": 1970,
    "genre": [
      "folk rock",
      "soul"
    ],
    "rating": 79,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9a/c7/e2/9ac7e266-1f0d-997a-fe43-6741bc96eda6/081227963637.jpg/1000x1000bb.jpg",
    "description": "Warm, soulful songwriting.",
    "tracks": [
      "And It Stoned Me",
      "Moondance",
      "Crazy Love",
      "Caravan",
      "Into the Mystic",
      "Come Running",
      "These Dreams of You",
      "Brand New Day",
      "Everyone",
      "Glad Tidings"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_qo0bcp",
    "title": "Lift Your Skinny Fists Like Antennas to Heaven",
    "artist": "Godspeed You! Black Emperor",
    "year": 2000,
    "genre": [
      "post-rock",
      "experimental"
    ],
    "rating": 78,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/5/57/Godspeed_You_Black_Emperor_-_Lift_Your_Skinny_Fists_Like_Antennas_to_Heaven.jpg",
    "description": "Cinematic, apocalyptic post-rock.",
    "tracks": [
      "Storm",
      "Static",
      "Sleep",
      "Like Antennas to Heaven..."
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_mw0n5v",
    "title": "Agaetis Byrjun",
    "artist": "Sigur Ros",
    "year": 1999,
    "genre": [
      "post-rock",
      "ambient"
    ],
    "rating": 77,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/64/be/7a/64be7a82-8d5a-d9a2-91b9-fc8ca608be5c/190296913341.jpg/1000x1000bb.jpg",
    "description": "Ethereal Icelandic post-rock.",
    "tracks": [
      "Untitled #1 (Vaka)",
      "Untitled #2 (Fyrsta)",
      "Untitled #3 (Samskeyti)",
      "Untitled #4 (Njósnavélin)",
      "Untitled #5 (Álafoss)",
      "Untitled #6 (E-Bow)",
      "Untitled #7 (Dauðalagið)",
      "Untitled #8 (Popplagið)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_2ultqw",
    "title": "Takk...",
    "artist": "Sigur Ros",
    "year": 2005,
    "genre": [
      "post-rock",
      "ambient"
    ],
    "rating": 76,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/ce/3e/b8/ce3eb805-fb13-0200-5856-081ed0014e13/190296926952.jpg/1000x1000bb.jpg",
    "description": "Warm and melodic post-rock landscapes.",
    "tracks": [
      "Takk...",
      "Glósóli",
      "Hoppípolla",
      "Með Blóðnasir",
      "Sé lest",
      "Sæglópur",
      "Mílanó",
      "Gong",
      "Andvari",
      "Svo hljótt",
      "Heysátan"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_8ixzib",
    "title": "Sound of Silver",
    "artist": "LCD Soundsystem",
    "year": 2007,
    "genre": [
      "dance-punk",
      "electronic"
    ],
    "rating": 75,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fb/fe/a5/fbfea51a-0130-d557-c1f4-9e5e98b7bab8/094638511359.jpg/1000x1000bb.jpg",
    "description": "Dance-punk with emotional depth.",
    "tracks": [
      "Get Innocuous!",
      "Time to Get Away",
      "North American Scum",
      "Someone Great",
      "All My Friends",
      "Us v Them",
      "Watch the Tapes",
      "Sound of Silver",
      "New York, I Love You But You're Bringing Me Down"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_4mod7a",
    "title": "This Is Happening",
    "artist": "LCD Soundsystem",
    "year": 2010,
    "genre": [
      "dance-punk",
      "electronic"
    ],
    "rating": 74,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/b/b6/LCD_Soundsystem_-_This_Is_Happening.jpg",
    "description": "James Murphy's bittersweet dance epic.",
    "tracks": [
      "Dance Yrself Clean",
      "Drunk Girls",
      "I Can Change",
      "You Wanted a Hit",
      "Pow Pow",
      "Somebody's Calling Me",
      "What You Need",
      "Home"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_j9gww5",
    "title": "Silent Shout",
    "artist": "The Knife",
    "year": 2006,
    "genre": [
      "electronic",
      "synth-pop"
    ],
    "rating": 73,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/dd/21/98/dd2198d3-7d38-f3ee-4801-efecfd25b024/5060236630209_1.jpg/1000x1000bb.jpg",
    "description": "Dark, twisted Swedish electronic pop.",
    "tracks": [
      "Silent Shout",
      "Neverland",
      "The Captain",
      "We Share Our Mothers' Health",
      "Na Na Na",
      "Marble House",
      "Like a Pen",
      "From Off to on",
      "Forest Families",
      "One Hit",
      "Still Light"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_mvi52e",
    "title": "Discovery",
    "artist": "Daft Punk",
    "year": 2001,
    "genre": [
      "house",
      "electronic"
    ],
    "rating": 72,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/1000x1000bb.jpg",
    "description": "French house's most joyful hour.",
    "tracks": [
      "One More Time",
      "Aerodynamic",
      "Digital Love",
      "Harder Better Faster Stronger",
      "Crescendolls",
      "Nightvision",
      "Superheroes",
      "High Life",
      "Something About Us",
      "Voyager",
      "Veridis Quo",
      "Short Circuit",
      "Face to Face",
      "Too Long"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_l7yzbo",
    "title": "Random Access Memories",
    "artist": "Daft Punk",
    "year": 2013,
    "genre": [
      "disco",
      "electronic"
    ],
    "rating": 71,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/1000x1000bb.jpg",
    "description": "A love letter to disco and studio musicians.",
    "tracks": [
      "Give Life Back to Music",
      "The Game of Love",
      "Giorgio by Moroder",
      "Within",
      "Instant Crush",
      "Lose Yourself to Dance",
      "Touch",
      "Get Lucky",
      "Beyond",
      "Motherboard",
      "Fragments of Time",
      "Doin' it Right",
      "Contact"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_lcef76",
    "title": "Good Kid, M.A.A.D City",
    "artist": "Kendrick Lamar",
    "year": 2012,
    "genre": [
      "hip hop",
      "west coast hip hop"
    ],
    "rating": 90,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/36/86/ec/3686ec99-dec4-0a01-8b74-2d8a9a0263a7/12UMGIM52988.rgb.jpg/1000x1000bb.jpg",
    "description": "A cinematic concept album about Compton.",
    "tracks": [
      "Sherane a.k.a Master Splinter’s Daughter",
      "Bitch, Don’t Kill My Vibe",
      "Backseat Freestyle",
      "The Art of Peer Pressure",
      "Money Trees (feat. Jay Rock)",
      "Poetic Justice (feat. Drake)",
      "Good Kid",
      "m.A.A.d city (feat. MC Eiht)",
      "Swimming Pools (Drank) [Extended Version]",
      "Sing About Me, I'm Dying of Thirst",
      "Real (feat. Anna Wise)",
      "Compton (feat. Dr. Dre)",
      "Bitch, Don’t Kill My Vibe (feat. JAŸ-Z) [Remix]"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_ovpye5",
    "title": "My Beautiful Dark Twisted Fantasy",
    "artist": "Kanye West",
    "year": 2010,
    "genre": [
      "hip hop",
      "progressive rap"
    ],
    "rating": 89,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/37/da/7c/37da7cc5-2b6f-9bb8-30ba-8a8c3be3e16a/00602527584973.rgb.jpg/1000x1000bb.jpg",
    "description": "A maximalist hip hop masterpiece.",
    "tracks": [
      "Dark Fantasy",
      "See Me Now (feat. Beyoncé, Charlie Wilson & Big Sean) [Bonus Track]",
      "Gorgeous (feat. Kid Cudi & Raekwon)",
      "Runway (Film)",
      "Power",
      "All of the Lights (Interlude)",
      "All of the Lights",
      "Monster (feat. JAŸ-Z, Rick Ross, Nicki Minaj & Bon Iver)",
      "So Appalled (feat. JAŸ-Z, Pusha T, Prynce Cy Hi, Swizz Beatz & RZA)",
      "Devil In a New Dress (feat. Rick Ross)",
      "Runaway (feat. Pusha T)",
      "Hell of a Life",
      "Blame Game (feat. John Legend)",
      "Lost In the World (feat. Bon Iver)",
      "Who Will Survive In America"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_ka5dt",
    "title": "Yeezus",
    "artist": "Kanye West",
    "year": 2013,
    "genre": [
      "hip hop",
      "industrial hip hop"
    ],
    "rating": 78,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f8/92/62/f892628e-bfd5-2437-c1f5-0ebbd366de09/00602577303098.rgb.jpg/1000x1000bb.jpg",
    "description": "Minimalist, abrasive and polarizing.",
    "tracks": [
      "I Thought About Killing You",
      "Yikes",
      "All Mine",
      "Wouldn't Leave (feat. PARTYNEXTDOOR)",
      "No Mistakes",
      "Ghost Town (feat. PARTYNEXTDOOR)",
      "Violent Crimes"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_1ixk81",
    "title": "Aquemini",
    "artist": "OutKast",
    "year": 1998,
    "genre": [
      "hip hop",
      "southern hip hop"
    ],
    "rating": 77,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0e/48/dd/0e48dd9a-07c9-46de-a838-b4ddb4e508a7/886448814191.jpg/1000x1000bb.jpg",
    "description": "OutKast's most cohesive blend of funk and rap.",
    "tracks": [
      "Hold On, Be Strong",
      "Return Of The \"G\"",
      "Rosa Parks (Radio Version)",
      "Skew It on the Bar-B (feat. Raekwon)",
      "Aquemini",
      "Synthesizer (feat. George Clinton)",
      "Slump",
      "West Savannah",
      "Da Art of Storytellin' (Pt. 1)",
      "Da Art of Storytellin' (Pt. 2)",
      "Mamacita",
      "SpottieOttieDopaliscious",
      "Y'All Scared (feat. T-Mo, Big Gipp & Khujo)",
      "Liberation (with Cee-Lo)",
      "Chonkyfire"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_5mzbym",
    "title": "ATLiens",
    "artist": "OutKast",
    "year": 1996,
    "genre": [
      "hip hop",
      "southern hip hop"
    ],
    "rating": 76,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/fb/1a/a0/fb1aa0c5-9f37-0a77-4044-9b1bd165660e/730082603225.jpg/1000x1000bb.jpg",
    "description": "Spacey, introspective Atlanta hip hop.",
    "tracks": [
      "You May Die (Intro)",
      "Two Dope Boyz (In a Cadillac)",
      "ATLiens",
      "Wheelz of Steel",
      "Jazzy Belle",
      "Elevators (Me & You)",
      "Ova Da Wudz",
      "Babylon",
      "Wailin'",
      "Mainstream (feat. Khujo & T-Mo)",
      "Decatur Psalm (feat. Big Gipp & Cool Breeze)",
      "Millennium",
      "E.T. (Extraterrestrial)",
      "13th Floor / Growing Old",
      "Elevators (Me & You) [ONP 86 Remix]"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_6vbmb8",
    "title": "Stankonia",
    "artist": "OutKast",
    "year": 2000,
    "genre": [
      "hip hop",
      "southern hip hop"
    ],
    "rating": 75,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/d6/21/fb/d621fbde-c099-6794-7102-2692f10c4dbb/886448814283.jpg/1000x1000bb.jpg",
    "description": "OutKast at their most explosive and ambitious.",
    "tracks": [
      "Intro",
      "Gasoline Dreams (with Khujo Goodie)",
      "I'm Cool (Interlude)",
      "So Fresh, So Clean (Radio Mix)",
      "Ms. Jackson (Radio Mix)",
      "Snappin' & Trappin' (feat. Killer Mike & J-Sweet)",
      "D.F. (Interlude)",
      "Spaghetti Junction",
      "Kim & Cookie (Interlude)",
      "I'll Call Before I Come (feat. Gangsta Boo & Eco)",
      "B.O.B. (Bombs Over Baghdad)",
      "Xplosion (feat. B-Real)",
      "Good Hair (Interlude)",
      "We Luv Deez Hoez (feat. Backbone & Big Gipp)",
      "Humble Mumble (feat. Erykah Badu)",
      "Drinkin' Again (Interlude)",
      "?",
      "Red Velvet",
      "Cruisin' In The ATL (Interlude)",
      "Gangsta Shit (feat. Slimm Calhoun, C-BONE & T-Mo)",
      "Toilet Tisha",
      "Slum Beautiful (feat. Cee-Lo)",
      "Pre-Nump (Interlude)",
      "Stankonia (Stanklove) [feat. Big Rube & Sleepy Brown]"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_ds88t2",
    "title": "Odelay",
    "artist": "Beck",
    "year": 1996,
    "genre": [
      "alternative rock",
      "folk rock"
    ],
    "rating": 74,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5b/bd/e5/5bbde5af-e430-2b74-1980-00bd784d8a27/00602577519956.rgb.jpg/1000x1000bb.jpg",
    "description": "Genre-hopping slacker rock masterpiece.",
    "tracks": [
      "Devils Haircut",
      "Where It's At (U.N.K.L.E. Remix)",
      "Hotwax",
      "Richard's Hairpiece (Aphex Twin Remix)",
      "Lord Only Knows",
      "American Wasteland",
      "The New Pollution",
      "Clock (Non)",
      "Derelict",
      "Thunderpeel",
      "Novacane",
      "Electric Music and the Summer People",
      "Jack-Ass",
      "Lemonade",
      "Where It's At",
      "SA-5",
      "Minus",
      "Feather in Your Cap",
      "Sissyneck",
      "Erase the Sun (Higher Speed & Tempo Version)",
      "Readymade",
      "000.000",
      "High 5 (Rock the Catskills)",
      "Brother",
      "Ramshackle",
      "Devil Got My Woman",
      "Computer Rock",
      "Trouble All My Days",
      "Deadweight",
      "Strange Invitation",
      "Inferno",
      "Burro (Mariachi Version)",
      "Gold Chains"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_1teqpv",
    "title": "Sea Change",
    "artist": "Beck",
    "year": 2002,
    "genre": [
      "folk rock",
      "singer-songwriter"
    ],
    "rating": 73,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b7/39/f5/b739f599-a321-9ddf-9691-6f888bd46f97/00602527874692.rgb.jpg/1000x1000bb.jpg",
    "description": "A heartbreaking acoustic breakup album.",
    "tracks": [
      "The Golden Age",
      "Paper Tiger",
      "Guess I'm Doing Fine",
      "Lonesome Tears",
      "Lost Cause",
      "End of the Day",
      "It's All In Your Mind",
      "Round the Bend",
      "Already Dead",
      "Sunday Sun",
      "Little One",
      "Side of the Road"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_9cs2ul",
    "title": "Surfer Rosa",
    "artist": "Pixies",
    "year": 1988,
    "genre": [
      "alternative rock",
      "indie rock"
    ],
    "rating": 72,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/02/b8/eb/02b8eb75-56b5-8b0f-cd1a-558d7d506871/713746310325.jpg/1000x1000bb.jpg",
    "description": "Raw, influential indie rock produced by Steve Albini.",
    "tracks": [
      "Bone Machine",
      "Break My Body",
      "Something Against You",
      "Broken Face",
      "Gigantic",
      "River Euphrates",
      "Where Is My Mind?",
      "Cactus",
      "Tony's Theme",
      "Oh My Golly!",
      "Vamos",
      "Chorale / I'm Amazed",
      "Brick Is Red"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_98527a",
    "title": "69 Love Songs",
    "artist": "The Magnetic Fields",
    "year": 1999,
    "genre": [
      "indie pop",
      "chamber pop"
    ],
    "rating": 71,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/c0/3a/e4/c03ae4d1-c49d-a255-acfb-7d0a98b5f9ed/bigup13158347.jpg/1000x1000bb.jpg",
    "description": "An ambitious three-volume song cycle about love.",
    "tracks": [
      "Magnetic Field"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_xg2m3k",
    "title": "The Soft Bulletin",
    "artist": "The Flaming Lips",
    "year": 1999,
    "genre": [
      "psychedelic rock",
      "alternative rock"
    ],
    "rating": 70,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/da/cc/ca/dacccae4-4f00-f451-6051-46d04a7d5099/093624911791.jpg/1000x1000bb.jpg",
    "description": "Orchestral psychedelia with open-hearted emotion.",
    "tracks": [
      "Race for the Prize",
      "A Spoonful Weighs a Ton",
      "The Spark That Bled",
      "The Spiderbite Song",
      "Buggin' (Mokran Mix)",
      "What Is the Light?",
      "The Observer",
      "Waitin' for a Superman",
      "Suddenly Everything Has Changed",
      "The Gash",
      "Feeling Yourself Disintegrate",
      "Sleeping On the Roof",
      "Race for the Prize (Mokran Mix)",
      "Waitin' for a Superman (Mokran Mix)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_ru09pn",
    "title": "Yoshimi Battles the Pink Robots",
    "artist": "The Flaming Lips",
    "year": 2002,
    "genre": [
      "psychedelic rock",
      "electronic"
    ],
    "rating": 69,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/8f/1f/f5/8f1ff578-4952-563a-7c4a-ab65e040ce95/093624913450.jpg/1000x1000bb.jpg",
    "description": "A quirky, emotional sci-fi concept album.",
    "tracks": [
      "Fight Test",
      "One More Robot / Sympathy 3000-21",
      "Yoshimi Battles the Pink Robots, Pt. 1",
      "Yoshimi Battles the Pink Robots, Pt. 2",
      "In the Morning of the Magicians",
      "Ego Tripping at the Gates of Hell",
      "Are You a Hypnotist??",
      "It's Summertime",
      "Do You Realize??",
      "All We Have Is Now",
      "Approaching Pavonis Mons By Balloon (Utopia Planitia)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.171Z",
      "cleanedAt": "2026-09-08T09:34:11.171Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_7dj1k6",
    "title": "In Rainbows",
    "artist": "Radiohead",
    "year": 2007,
    "genre": [
      "alternative rock",
      "art rock"
    ],
    "rating": 88,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dd/50/c7/dd50c790-99ac-d3d0-5ab8-e3891fb8fd52/634904032463.png/1000x1000bb.jpg",
    "description": "Radiohead's most human and melodic album.",
    "tracks": [
      "15 Step",
      "Bodysnatchers",
      "Nude",
      "Weird Fishes / Arpeggi",
      "All I Need",
      "Faust Arp",
      "Reckoner",
      "House of Cards",
      "Jigsaw Falling Into Place",
      "Videotape"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_utme7f",
    "title": "Kid A",
    "artist": "Radiohead",
    "year": 2000,
    "genre": [
      "electronic",
      "experimental rock"
    ],
    "rating": 87,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/8e/13/bd8e1358-b367-a689-cb84-cebd0b067dc4/634904078263.png/1000x1000bb.jpg",
    "description": "A polarizing but influential electronic turn.",
    "tracks": [
      "Everything In Its Right Place",
      "Kid A",
      "The National Anthem",
      "How to Disappear Completely",
      "Treefingers",
      "Optimistic",
      "In Limbo",
      "Idioteque",
      "Morning Bell",
      "Motion Picture Soundtrack",
      "Untitled"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_u21at5",
    "title": "The Bends",
    "artist": "Radiohead",
    "year": 1995,
    "genre": [
      "alternative rock",
      "britpop"
    ],
    "rating": 86,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1b/a9/5c/1ba95cac-b245-d386-63fb-6b857aa9dce8/634904078065.png/1000x1000bb.jpg",
    "description": "Radiohead's guitar-driven breakthrough.",
    "tracks": [
      "Planet Telex",
      "The Bends",
      "High and Dry",
      "Fake Plastic Trees",
      "Bones",
      "(Nice Dream)",
      "Just",
      "My Iron Lung",
      "Bullet Proof ... I Wish I Was",
      "Black Star",
      "Sulk",
      "Street Spirit (Fade Out)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_ullv6u",
    "title": "Dummy",
    "artist": "Portishead",
    "year": 1994,
    "genre": [
      "trip hop",
      "electronic"
    ],
    "rating": 78,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/1000x1000bb.jpg",
    "description": "The definitive trip hop debut.",
    "tracks": [
      "Mysterons",
      "Sour Times",
      "Strangers",
      "It Could Be Sweet",
      "Wandering Star",
      "It's a Fire",
      "Numb",
      "Roads",
      "Pedestal",
      "Biscuit",
      "Glory Box"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_axk4vm",
    "title": "Mezzanine",
    "artist": "Massive Attack",
    "year": 1998,
    "genre": [
      "trip hop",
      "electronic"
    ],
    "rating": 77,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/8a/c1/04/8ac104fb-d37e-1433-5d2e-805710d7a7c4/00602567930983.rgb.jpg/1000x1000bb.jpg",
    "description": "Dark, paranoid trip hop masterpiece.",
    "tracks": [
      "Angel (Remastered 2018)",
      "Metal Banshee (Mad Prof Mix)",
      "Risingson (Remastered 2018)",
      "Angel (Angel Dust)",
      "Teardrop (Remastered 2018)",
      "Teardrop (Mazaruni Dub One)",
      "Inertia Creeps (Remastered 2018)",
      "Inertia Creeps (Floating On Dubwise)",
      "Exchange (Remastered 2018)",
      "Risingson (Setting Sun Dub Two)",
      "Dissolved Girl (Remastered 2018)",
      "Exchange (Mountain Steppers Dub)",
      "Man Next Door (Remastered 2018)",
      "Wire (Leaping Dub)",
      "Black Milk (Remastered 2018)",
      "Group Four (Security Forces Dub)",
      "Mezzanine (Remastered 2018)",
      "Group Four (Remastered 2018)",
      "(Exchange) [Remastered 2018]"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_x07g0y",
    "title": "Currents",
    "artist": "Tame Impala",
    "year": 2015,
    "genre": [
      "psychedelic pop",
      "electronic"
    ],
    "rating": 76,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/64/48/5c/64485cc9-968c-68cc-764e-9a7c71733def/00602567155454.rgb.jpg/1000x1000bb.jpg",
    "description": "Kevin Parker's polished psych-pop breakthrough.",
    "tracks": [
      "List of People (To Try and Forget About)",
      "Powerlines",
      "Taxi’s Here",
      "Reality in Motion (Gum Remix)",
      "Let it Happen (Soulwax Remix)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_atzrvx",
    "title": "Lonerism",
    "artist": "Tame Impala",
    "year": 2012,
    "genre": [
      "psychedelic rock",
      "neo-psychedelia"
    ],
    "rating": 75,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b7/40/9b/b7409bc6-24fa-b956-5613-4be8dc62be06/12UMGIM64219.rgb.jpg/1000x1000bb.jpg",
    "description": "Introspective psychedelia with lush production.",
    "tracks": [
      "Be Above It",
      "Endors Toi",
      "Apocalypse Dreams",
      "Mind Mischief",
      "Music To Walk Home By",
      "Why Won't They Talk To Me?",
      "Feels Like We Only Go Backwards",
      "Keep On Lying",
      "Elephant",
      "Led Zeppelin",
      "She Just Won't Believe Me",
      "Nothing That Has Happened So Far Has Been Anything We Could Control",
      "Sun's Coming Up"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_qn4960",
    "title": "CHANNEL ORANGE",
    "artist": "Frank Ocean",
    "year": 2012,
    "genre": [
      "r&b",
      "neo-soul"
    ],
    "rating": 80,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a4/4b/c0/a44bc0c3-3866-7fad-8ba1-a145fcc9e92b/191773449094.jpg/1000x1000bb.jpg",
    "description": "A genre-blurring R&B concept album.",
    "tracks": [
      "Thinkin Bout You (feat. Rob Arthur)",
      "Sierra Leone (feat. Rob Arthur)",
      "Sweet Life (feat. Rob Arthur)",
      "Super Rich Kids (feat. Rob Arthur)",
      "Pilot Jones (feat. Rob Arthur)",
      "Crack Rock (feat. Rob Arthur)",
      "Pyramids (feat. Rob Arthur)",
      "Lost (feat. Rob Arthur)",
      "White (feat. Rob Arthur)",
      "Monks (feat. Rob Arthur)",
      "Bad Religion (feat. Rob Arthur)",
      "Pink Matter (feat. Rob Arthur)",
      "Forrest Gump (feat. Rob Arthur)",
      "End (feat. Rob Arthur)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_qj693t",
    "title": "Blonde",
    "artist": "Frank Ocean",
    "year": 2016,
    "genre": [
      "r&b",
      "ambient pop"
    ],
    "rating": 79,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg",
    "description": "Intimate, fragmented and deeply personal.",
    "tracks": [
      "Nikes",
      "Ivy",
      "Pink + White",
      "Be Yourself",
      "Solo",
      "Skyline To",
      "Self Control",
      "Good Guy",
      "Nights",
      "Solo (Reprise)",
      "Pretty Sweet",
      "Facebook Story",
      "Close to You",
      "White Ferrari",
      "Seigfried",
      "Godspeed",
      "Futura Free"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_9b7qlm",
    "title": "Hounds of Love",
    "artist": "Kate Bush",
    "year": 1985,
    "genre": [
      "art pop",
      "progressive pop"
    ],
    "rating": 78,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/8/86/Kate_Bush_-_Hounds_of_Love.png",
    "description": "Kate Bush's commercial and artistic peak.",
    "tracks": [
      "Running Up That Hill (A Deal with God)",
      "Hounds of Love",
      "The Big Sky",
      "Mother Stands for Comfort",
      "Cloudbusting",
      "And Dream of Sheep",
      "Under Ice",
      "Waking the Witch",
      "Watching You Without Me",
      "Jig of Life",
      "Hello Earth",
      "The Morning Fog"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_fmgeom",
    "title": "Heaven or Las Vegas",
    "artist": "Cocteau Twins",
    "year": 1990,
    "genre": [
      "dream pop",
      "ethereal wave"
    ],
    "rating": 77,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/76/cd/61/76cd61e7-0714-dce5-c48e-0f05f8fcb84b/652637001280.png/1000x1000bb.jpg",
    "description": "The most accessible Cocteau Twins masterpiece.",
    "tracks": [
      "Cherry-Coloured Funk",
      "Pitch the Baby",
      "Iceblink Luck",
      "Fifty-Fifty Clown",
      "Heaven or Las Vegas",
      "I Wear Your Ring",
      "Fotzepolitic",
      "Wolf In the Breast",
      "Road, River and Rail",
      "Frou-Frou Foxes In Midsummer Fires"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_2fclew",
    "title": "Fear of Music",
    "artist": "Talking Heads",
    "year": 1979,
    "genre": [
      "new wave",
      "art punk"
    ],
    "rating": 74,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/9c/3c/99/mzi.pofqgfsx.jpg/1000x1000bb.jpg",
    "description": "Paranoid, funky new wave.",
    "tracks": [
      "I Zimbra",
      "Mind",
      "Paper",
      "Cities",
      "Life During Wartime",
      "Memories Can't Wait",
      "Air",
      "Heaven",
      "Animals",
      "Electric Guitar",
      "Drugs"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_jv99d4",
    "title": "Wish You Were Here",
    "artist": "Pink Floyd",
    "year": 1975,
    "genre": [
      "progressive rock",
      "art rock"
    ],
    "rating": 73,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/aa/e0/ab/aae0ab6a-d906-a189-81bf-70b56aa43f7a/886445635843.jpg/1000x1000bb.jpg",
    "description": "A melancholic tribute to Syd Barrett.",
    "tracks": [
      "Shine On You Crazy Diamond, Pts. 1-5",
      "Welcome to the Machine",
      "Have a Cigar",
      "Wish You Were Here",
      "Shine On You Crazy Diamond, Pts. 6-9"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_5ifpkk",
    "title": "Animals",
    "artist": "Pink Floyd",
    "year": 1977,
    "genre": [
      "progressive rock",
      "art rock"
    ],
    "rating": 72,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/24/13/ba/2413bae0-a8b3-bd1d-72e7-d7c1dadb5d85/889466257360.jpg/1000x1000bb.jpg",
    "description": "Orwellian prog-rock concept album.",
    "tracks": [
      "Pigs on the Wing, Pt. 1",
      "Dogs",
      "Pigs (Three Different Ones)",
      "Sheep",
      "Pigs on the Wing, Pt. 2"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_bw501w",
    "title": "The Wall",
    "artist": "Pink Floyd",
    "year": 1979,
    "genre": [
      "progressive rock",
      "art rock"
    ],
    "rating": 71,
    "source": "RYM",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/1000x1000bb.jpg",
    "description": "A sprawling rock opera about isolation.",
    "tracks": [
      "In the Flesh?",
      "Hey You",
      "The Thin Ice",
      "Is There Anybody Out There?",
      "Another Brick In the Wall, Pt. 1",
      "Nobody Home",
      "The Happiest Days of Our Lives",
      "Vera",
      "Another Brick In the Wall, Pt. 2",
      "Bring the Boys Back Home",
      "Mother",
      "Comfortably Numb",
      "Goodbye Blue Sky",
      "The Show Must Go On",
      "Empty Spaces",
      "In the Flesh",
      "Young Lust",
      "Run Like Hell",
      "One of My Turns",
      "Waiting for the Worms",
      "Don't Leave Me Now",
      "Stop",
      "Another Brick In the Wall, Pt. 3",
      "The Trial",
      "Goodbye Cruel World",
      "Outside the Wall"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_rzkv48",
    "title": "Ready to Die",
    "artist": "The Notorious B.I.G.",
    "year": 1994,
    "genre": [
      "hip hop",
      "east coast hip hop"
    ],
    "rating": 76,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f8/6a/3d/f86a3db0-d518-cd49-c0c9-25e767ae0a6d/075679456861.jpg/1000x1000bb.jpg",
    "description": "A vivid, autobiographical East Coast classic.",
    "tracks": [
      "Intro",
      "Things Done Changed",
      "Gimme the Loot",
      "Machine Gun Funk",
      "Warning",
      "Ready To Die",
      "One More Chance",
      "#!*@ Me",
      "The What",
      "Juicy",
      "Everyday Struggle",
      "Me and My B*tch",
      "Big Poppa",
      "Respect",
      "Friend of Mine",
      "Unbelievable",
      "Suicidal Thoughts",
      "Who Shot Ya",
      "Just Playing (Dreams)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_b3wsrc",
    "title": "Reasonable Doubt",
    "artist": "Jay-Z",
    "year": 1996,
    "genre": [
      "hip hop",
      "east coast hip hop"
    ],
    "rating": 75,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bb/d6/d6/bbd6d6f4-4a42-8878-0b2b-c745ef18d0c8/1809.jpg/1000x1000bb.jpg",
    "description": "Jay-Z's mafioso rap debut.",
    "tracks": [
      "Reasonable Doubt (Fireworks Supermix)"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_rzfb17",
    "title": "The College Dropout",
    "artist": "Kanye West",
    "year": 2004,
    "genre": [
      "hip hop",
      "conscious hip hop"
    ],
    "rating": 74,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/15/05/09/15050911-a2f1-9ebc-0d16-6e8faad1cf80/00602567924326.rgb.jpg/1000x1000bb.jpg",
    "description": "Kanye's soul-sampling, backpack-rap debut.",
    "tracks": [
      "Intro",
      "We Don't Care",
      "Graduation Day",
      "All Falls Down (feat. Syleena Johnson)",
      "I'll Fly Away",
      "Spaceship (feat. GLC & Consequence)",
      "Jesus Walks",
      "Never Let Me Down (feat. JAŸ-Z & J. Ivy)",
      "Get Em High (feat. Talib Kweli & Common)",
      "Workout Plan",
      "The New Workout Plan",
      "Slow Jamz",
      "Breathe In Breathe Out (feat. Ludacris)",
      "School Spirit Skit 1",
      "School Spirit",
      "School Spirit Skit 2",
      "Lil Jimmy Skit",
      "Two Words (feat. Mos Def, Freeway & The Boys Choir of Harlem)",
      "Through the Wire",
      "Family Business",
      "Last Call"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_hrlxyz",
    "title": "Lemonade",
    "artist": "Beyonce",
    "year": 2016,
    "genre": [
      "r&b",
      "pop"
    ],
    "rating": 73,
    "source": "Metacritic",
    "sourceUrl": "",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4b/f9/b2/4bf9b27f-0a7f-7536-afe7-dcb18f5d49e9/1850.jpg/1000x1000bb.jpg",
    "description": "A visual album of betrayal, healing and empowerment.",
    "tracks": [
      "Pray You Catch Me",
      "Hold Up",
      "Don't Hurt Yourself",
      "Sorry",
      "6 Inch",
      "Daddy Lessons",
      "Love Drought",
      "Sandcastles",
      "Forward",
      "Freedom",
      "All Night",
      "Formation"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  },
  {
    "_id": "album_7dnzyn",
    "title": "Age of Adz",
    "artist": "Sufjan Stevens",
    "year": 2010,
    "genre": [
      "indie folk",
      "electronic"
    ],
    "rating": 72,
    "source": "Pitchfork",
    "sourceUrl": "",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/en/6/6f/Sufjan_Stevens_-_Age_of_Adz.jpg",
    "description": "An electronic-folk epic about love and apocalypse.",
    "tracks": [
      "Futile Devices",
      "Too Much",
      "Age of Adz",
      "I Walked",
      "Now That I'm Older",
      "Get Real Get Right",
      "Bad Communication",
      "Vesuvius",
      "I Want To Be Well",
      "Impossible Soul"
    ],
    "label": null,
    "producer": null,
    "duration": null,
    "mood": [],
    "energy": null,
    "bpm": null,
    "tags": [],
    "culturalContext": null,
    "embedding": null,
    "metadata": {
      "crawledAt": "2026-09-08T09:34:11.172Z",
      "cleanedAt": "2026-09-08T09:34:11.172Z",
      "importBatch": "p0"
    }
  }
];

// 数据校验：确保每条专辑都有 title 和 artist
function validateAlbum(album) {
  const errors = [];
  if (!album.title || typeof album.title !== 'string') {
    errors.push('title 缺失或格式错误');
  }
  if (!album.artist || typeof album.artist !== 'string') {
    errors.push('artist 缺失或格式错误');
  }
  return errors;
}

// 规范化风格字段为数组
function normalizeGenre(genre) {
  if (Array.isArray(genre)) {
    return genre.map(g => g.trim()).filter(Boolean);
  }
  if (typeof genre === 'string') {
    return genre.split(/[,|/]/).map(g => g.trim()).filter(Boolean);
  }
  return [];
}

// 规范化曲目字段为数组
function normalizeTracks(tracks) {
  if (Array.isArray(tracks)) {
    return tracks.map(t => t.trim()).filter(Boolean);
  }
  if (typeof tracks === 'string') {
    return tracks.split(/[|]/).map(t => t.trim()).filter(Boolean);
  }
  return [];
}

// 规范化输入专辑列表，过滤无效数据
function normalizeAlbums(inputAlbums) {
  const list = Array.isArray(inputAlbums) ? inputAlbums : [];
  const valid = [];

  for (const album of list) {
    const errors = validateAlbum(album);
    if (errors.length > 0) {
      console.warn(`[导入数据] 跳过无效数据: ${errors.join(', ')}`);
      continue;
    }

    valid.push({
      ...album,
      genre: normalizeGenre(album.genre),
      tracks: normalizeTracks(album.tracks)
    });
  }

  return valid;
}

// 批量并行处理工具函数
async function batchProcess(items, batchSize, processor) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(processor));
    console.log(`[导入数据] 批量处理进度: ${Math.min(i + batchSize, items.length)}/${items.length}`);
  }
}

exports.main = async (event, context) => {
  const { clear = false } = event;
  // 支持通过 event.albums 传入外部数据，否则使用默认种子数据
  const albums = normalizeAlbums(event.albums || DEFAULT_ALBUMS);

  console.log('[导入数据] 模式:', clear ? '清空模式' : '智能模式');
  console.log('[导入数据] 待导入专辑数:', albums.length);

  try {
    // 清空模式：先批量删除所有数据
    if (clear) {
      console.log('[导入数据] 清空模式：开始删除所有数据...');
      const deleteResult = await db.collection('albums').where({
        _id: _.exists(true)
      }).remove();
      console.log('[导入数据] 删除完成:', deleteResult.stats);
    }

    // 智能模式：根据 title+artist 去重并更新
    if (!clear) {
      const { total: existingCount } = await db.collection('albums').count();
      console.log('[导入数据] 现有数据量:', existingCount);

      if (existingCount > 0) {
        // 一次性查询所有现有数据（limit 100，足够覆盖50条）
        const { data: existingData } = await db.collection('albums').limit(100).get();
        const existingMap = new Map();
        existingData.forEach(item => {
          const key = `${item.title}::${item.artist}`;
          existingMap.set(key, item._id);
        });

        let updated = 0;
        let added = 0;

        await batchProcess(albums, 10, async (album) => {
          const key = `${album.title}::${album.artist}`;
          const existingId = existingMap.get(key);

          if (existingId) {
            // 已存在则更新（排除 _id，云数据库不允许更新 _id）
            const { _id, ...updateData } = album;
            await db.collection('albums').doc(existingId).update({
              data: { ...updateData, updateTime: db.serverDate() }
            });
            updated++;
          } else {
            // 不存在则新增
            await db.collection('albums').add({
              data: { ...album, createTime: db.serverDate() }
            });
            added++;
          }
        });

        return {
          success: true,
          message: `智能模式：已更新 ${updated} 条，新增 ${added} 条`,
          updated,
          added,
          total: albums.length
        };
      }
    }

    // 数据为空或清空后：分批导入所有数据
    let imported = 0;
    await batchProcess(albums, 10, async (album) => {
      await db.collection('albums').add({
        data: { ...album, createTime: db.serverDate() }
      });
      imported++;
    });

    return {
      success: true,
      message: clear ? `清空模式：导入完成` : `导入完成`,
      imported,
      total: albums.length
    };

  } catch (err) {
    console.error('[导入数据] 错误:', err);
    return { success: false, message: err.message };
  }
};
