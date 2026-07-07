const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// 50张专辑数据
const albums = 
  [
    {
      "title": "The Dark Side of the Moon",
      "artist": "Pink Floyd",
      "year": 1973,
      "genre": "rock, progressive rock",
      "rating": 99,
      "coverUrl": "https://picsum.photos/id/22/300/300",
      "description": "One of the best-selling albums of all time",
      "tracks": "Speak to Me|Breathe|On the Run|Time|The Great Gig in the Sky|Money|Us and Them|Any Colour You Like|Brain Damage|Eclipse"
    },
    {
      "title": "Kind of Blue",
      "artist": "Miles Davis",
      "year": 1959,
      "genre": "jazz, modal jazz",
      "rating": 98,
      "coverUrl": "https://picsum.photos/id/94/300/300",
      "description": "The best-selling jazz record of all time",
      "tracks": "So What|Freddie Freeloader|Blue in Green|All Blues|Flamenco Sketches"
    },
    {
      "title": "Abbey Road",
      "artist": "The Beatles",
      "year": 1969,
      "genre": "rock, pop",
      "rating": 97,
      "coverUrl": "https://picsum.photos/id/20/300/300",
      "description": "The Beatles' final masterpiece",
      "tracks": "Come Together|Something|Maxwell's Silver Hammer|Oh! Darling|Octopus's Garden|I Want You (She's So Heavy)|Here Comes the Sun|Because|You Never Give Me Your Money|Golden Slumbers|Carry That Weight|The End"
    },
    {
      "title": "OK Computer",
      "artist": "Radiohead",
      "year": 1997,
      "genre": "alternative rock, art rock",
      "rating": 96,
      "coverUrl": "https://picsum.photos/id/89/300/300",
      "description": "A landmark album of the 90s",
      "tracks": "Airbag|Paranoid Android|Subterranean Homesick Alien|Exit Music (For a Film)|Let Down|Karma Police|Fitter Happier|Electioneering|Climbing Up the Walls|No Surprises|Lucky|The Tourist"
    },
    {
      "title": "Illmatic",
      "artist": "Nas",
      "year": 1994,
      "genre": "hip hop, east coast hip hop",
      "rating": 95,
      "coverUrl": "https://picsum.photos/id/130/300/300",
      "description": "One of the greatest hip hop albums ever",
      "tracks": "The Genesis|N.Y. State of Mind|Life's a Bitch|The World Is Yours|Halftime|Memory Lane (Sittin' in da Park)|One Love|One Time 4 Your Mind|Represent|It Ain't Hard to Tell"
    },
    {
      "title": "Loveless",
      "artist": "My Bloody Valentine",
      "year": 1991,
      "genre": "shoegaze, noise pop",
      "rating": 94,
      "coverUrl": "https://picsum.photos/id/149/300/300",
      "description": "The definitive shoegaze album",
      "tracks": "Only Shallow|Loomer|Touched|To Here Knows When|When You Sleep|I Only Said|Come in Alone|Sometimes|Blown a Wish|What You Want|Soon"
    },
    {
      "title": "Madvillainy",
      "artist": "Madvillain",
      "year": 2004,
      "genre": "hip hop, alternative hip hop",
      "rating": 93,
      "coverUrl": "https://picsum.photos/id/76/300/300",
      "description": "MF DOOM and Madlib's masterpiece",
      "tracks": "The Illest Villains|Accordion|Meat Grinder|Bistro|Raid|America's Most Blunted|Sickfit|Rainbows|Curls|Do Not Fire!|Shadows of Tomorrow"
    },
    {
      "title": "In the Aeroplane Over the Sea",
      "artist": "Neutral Milk Hotel",
      "year": 1998,
      "genre": "indie rock, folk",
      "rating": 92,
      "coverUrl": "https://picsum.photos/id/64/300/300",
      "description": "A cult classic of indie rock",
      "tracks": "King of Carrot Flowers Pt. One|King of Carrot Flowers Pts. Two & Three|In the Aeroplane Over the Sea|Two-Headed Boy|The Fool|Holland, 1945|Communist Daughter|Oh Comely|Ghost|Untitled|Two-Headed Boy Pt. Two"
    },
    {
      "title": "To Pimp a Butterfly",
      "artist": "Kendrick Lamar",
      "year": 2015,
      "genre": "hip hop, jazz rap",
      "rating": 91,
      "coverUrl": "https://picsum.photos/id/58/300/300",
      "description": "A modern hip hop masterpiece",
      "tracks": "Wesley's Theory|For Free?|King Kunta|Institutionalized|These Walls|u|Alright|For Sale?|Momma|Hood Politics|How Much a Dollar Cost|Complexion (A Zulu Love)|The Blacker the Berry|You Ain't Gotta Lie|i|Mortal Man"
    },
    {
      "title": "Pet Sounds",
      "artist": "The Beach Boys",
      "year": 1966,
      "genre": "pop, baroque pop",
      "rating": 90,
      "coverUrl": "https://picsum.photos/id/172/300/300",
      "description": "Brian Wilson's pop symphony",
      "tracks": "Wouldn't It Be Nice|You Still Believe in Me|That's Not Me|Don't Talk (Put Your Head on My Shoulder)|I'm Waiting for the Day|Let's Go Away for Awhile|Sloop John B|God Only Knows|I Know There's an Answer|Here Today|I Just Wasn't Made for These Times|Pet Sounds|Caroline, No"
    },
    {
      "title": "Revolver",
      "artist": "The Beatles",
      "year": 1966,
      "genre": "rock, psychedelic rock",
      "rating": 89,
      "coverUrl": "https://picsum.photos/id/180/300/300",
      "description": "The Beatles' most innovative album",
      "tracks": "Taxman|Eleanor Rigby|I'm Only Sleeping|Love You To|Here, There and Everywhere|Yellow Submarine|She Said She Said|Good Day Sunshine|And Your Bird Can Sing|For No One|Doctor Robert|I Want to Tell You|Got to Get You into My Life|Tomorrow Never Knows"
    },
    {
      "title": "Highway 61 Revisited",
      "artist": "Bob Dylan",
      "year": 1965,
      "genre": "folk rock, blues rock",
      "rating": 88,
      "coverUrl": "https://picsum.photos/id/191/300/300",
      "description": "Dylan's electric masterpiece",
      "tracks": "Like a Rolling Stone|Tombstone Blues|It Takes a Lot to Laugh|From a Buick 6|Ballad of a Thin Man|Queen Jane Approximately|Highway 61 Revisited|Just Like Tom Thumb's Blues|Desolation Row"
    },
    {
      "title": "Thriller",
      "artist": "Michael Jackson",
      "year": 1982,
      "genre": "pop, r&b",
      "rating": 87,
      "coverUrl": "https://picsum.photos/id/195/300/300",
      "description": "The best-selling album of all time",
      "tracks": "Wanna Be Startin' Somethin'|Baby Be Mine|The Girl Is Mine|Thriller|Beat It|Billie Jean|Human Nature|P.Y.T. (Pretty Young Thing)|The Lady in My Life"
    },
    {
      "title": "Nevermind",
      "artist": "Nirvana",
      "year": 1991,
      "genre": "grunge, alternative rock",
      "rating": 86,
      "coverUrl": "https://picsum.photos/id/119/300/300",
      "description": "The album that changed rock music",
      "tracks": "Smells Like Teen Spirit|In Bloom|Come as You Are|Breed|Lithium|Polly|Territorial Pissings|Drain You|Lounge Act|Stay Away|On a Plain|Something in the Way"
    },
    {
      "title": "Remain in Light",
      "artist": "Talking Heads",
      "year": 1980,
      "genre": "new wave, art pop",
      "rating": 85,
      "coverUrl": "https://picsum.photos/id/137/300/300",
      "description": "Afrobeat meets new wave",
      "tracks": "Born Under Punches (The Heat Goes On)|Crosseyed and Painless|The Great Curve|Once in a Lifetime|Houses in Motion|Seen and Not Seen|Listening Wind|The Overload"
    },
    {
      "title": "The Rise and Fall of Ziggy Stardust",
      "artist": "David Bowie",
      "year": 1972,
      "genre": "glam rock, art rock",
      "rating": 84,
      "coverUrl": "https://picsum.photos/id/154/300/300",
      "description": "Bowie's alien rock opera",
      "tracks": "Five Years|Soul Love|Moonage Daydream|Starman|It Ain't Easy|Lady Stardust|Star|Hang On to Yourself|Ziggy Stardust|Suffragette City|Rock 'n' Roll Suicide"
    },
    {
      "title": "A Love Supreme",
      "artist": "John Coltrane",
      "year": 1965,
      "genre": "jazz, modal jazz",
      "rating": 83,
      "coverUrl": "https://picsum.photos/id/175/300/300",
      "description": "A spiritual jazz journey",
      "tracks": "Part I: Acknowledgement|Part II: Resolution|Part III: Pursuance|Part IV: Psalm"
    },
    {
      "title": "Unknown Pleasures",
      "artist": "Joy Division",
      "year": 1979,
      "genre": "post-punk, gothic rock",
      "rating": 82,
      "coverUrl": "https://picsum.photos/id/146/300/300",
      "description": "The sound of post-punk despair",
      "tracks": "Disorder|Day of the Lords|Candidate|Insight|New Dawn Fades|She's Lost Control|Shadowplay|Wilderness|Interzone|I Remember Nothing"
    },
    {
      "title": "Purple Rain",
      "artist": "Prince",
      "year": 1984,
      "genre": "pop, funk",
      "rating": 81,
      "coverUrl": "https://picsum.photos/id/177/300/300",
      "description": "Prince's magnum opus",
      "tracks": "Let's Go Crazy|Take Me with U|The Beautiful Ones|Computer Blue|Darling Nikki|When Doves Cry|I Would Die 4 U|Baby I'm a Star|Purple Rain"
    },
    {
      "title": "Enter the Wu-Tang",
      "artist": "Wu-Tang Clan",
      "year": 1993,
      "genre": "hip hop, hardcore hip hop",
      "rating": 80,
      "coverUrl": "https://picsum.photos/id/188/300/300",
      "description": "Raw East Coast hip hop",
      "tracks": "Bring da Ruckus|Shame on a Nigga|Clan in da Front|Wu-Tang: 7th Chamber|Can It Be All So Simple|Da Mystery of Chessboxin'|Method Man|Protect Ya Neck|Tearz"
    },
    {
      "title": "Sgt. Pepper's Lonely Hearts Club Band",
      "artist": "The Beatles",
      "year": 1967,
      "genre": "rock, psychedelic rock",
      "rating": 98,
      "coverUrl": "https://picsum.photos/id/34/300/300",
      "description": "A landmark in music history",
      "tracks": "Sgt. Pepper's Lonely Hearts Club Band|With a Little Help from My Friends|Lucy in the Sky with Diamonds|Getting Better|Fixing a Hole|She's Leaving Home|Being for the Benefit of Mr. Kite!|Within You Without You|When I'm Sixty-Four|Lovely Rita|Good Morning Good Morning|Sgt. Pepper's Lonely Hearts Club Band (Reprise)|A Day in the Life"
    },
    {
      "title": "What's Going On",
      "artist": "Marvin Gaye",
      "year": 1971,
      "genre": "soul, r&b",
      "rating": 97,
      "coverUrl": "https://picsum.photos/id/45/300/300",
      "description": "A concept album masterpiece",
      "tracks": "What's Going On|What's Happening Brother|Flyin' High (In the Friendly Sky)|Save the Children|God Is Love|Mercy Mercy Me (The Ecology)|Right On|Wholy Holy|Inner City Blues (Make Me Wanna Holler)"
    },
    {
      "title": "Blood on the Tracks",
      "artist": "Bob Dylan",
      "year": 1975,
      "genre": "folk rock, singer-songwriter",
      "rating": 96,
      "coverUrl": "https://picsum.photos/id/56/300/300",
      "description": "Dylan's emotional masterpiece",
      "tracks": "Tangled Up in Blue|Simple Twist of Fate|You're a Big Girl Now|Idiot Wind|You're Gonna Make Me Lonesome When You Go|Meet Me in the Morning|Lily, Rosemary and the Jack of Hearts|If You See Her, Say Hello|Shelter from the Storm|Buckets of Rain"
    },
    {
      "title": "The Velvet Underground & Nico",
      "artist": "The Velvet Underground",
      "year": 1967,
      "genre": "art rock, experimental",
      "rating": 95,
      "coverUrl": "https://picsum.photos/id/67/300/300",
      "description": "The album that started a thousand bands",
      "tracks": "Sunday Morning|I'm Waiting for the Man|Femme Fatale|Venus in Furs|Run Run Run|All Tomorrow's Parties|Heroin|There She Goes Again|I'll Be Your Mirror|The Black Angel's Death Song|European Son"
    },
    {
      "title": "London Calling",
      "artist": "The Clash",
      "year": 1979,
      "genre": "punk, new wave",
      "rating": 94,
      "coverUrl": "https://picsum.photos/id/78/300/300",
      "description": "Punk rock's masterpiece",
      "tracks": "London Calling|Brand New Cadillac|Jimmy Jazz|Hateful|Rudie Can't Fail|Spanish Bombs|The Right Profile|Lost in the Supermarket|Clampdown|The Guns of Brixton|Wrong 'Em Boyo|Death or Glory|Koka Kola|The Card Cheat|Lover's Rock|Four Horsemen|I'm Not Down|Revolution Rock|Train in Vain"
    },
    {
      "title": "Blonde on Blonde",
      "artist": "Bob Dylan",
      "year": 1966,
      "genre": "folk rock, blues rock",
      "rating": 93,
      "coverUrl": "https://picsum.photos/id/87/300/300",
      "description": "Dylan's rock trilogy conclusion",
      "tracks": "Rainy Day Women #12 & 35|Pledging My Time|Visions of Johanna|One of Us Must Know (Sooner or Later)|I Want You|Stuck Inside of Mobile with the Memphis Blues Again|Leopard-Skin Pill-Box Hat|Just Like a Woman|Most Likely You Go Your Way (And I'll Go Mine)|Temporary Like Achilles|Absolutely Sweet Marie|4th Time Around|Obviously 5 Believers|Sad Eyed Lady of the Lowlands"
    },
    {
      "title": "The Queen Is Dead",
      "artist": "The Smiths",
      "year": 1986,
      "genre": "indie rock, alternative rock",
      "rating": 92,
      "coverUrl": "https://picsum.photos/id/96/300/300",
      "description": "The pinnacle of indie rock",
      "tracks": "The Queen Is Dead|Frankly, Mr. Shankly|I Know It's Over|Never Had No One Ever|Cemetry Gates|Bigmouth Strikes Again|The Boy with the Thorn in His Side|Vicar in a Tutu|There Is a Light That Never Goes Out|Some Girls Are Bigger Than Others"
    },
    {
      "title": "Blue",
      "artist": "Joni Mitchell",
      "year": 1971,
      "genre": "folk, singer-songwriter",
      "rating": 91,
      "coverUrl": "https://picsum.photos/id/106/300/300",
      "description": "A confessional masterpiece",
      "tracks": "All I Want|My Old Man|Little Green|Carey|Blue|California|This Flight Tonight|River|A Case of You|The Last Time I Saw Richard"
    },
    {
      "title": "Led Zeppelin IV",
      "artist": "Led Zeppelin",
      "year": 1971,
      "genre": "hard rock, folk rock",
      "rating": 90,
      "coverUrl": "https://picsum.photos/id/115/300/300",
      "description": "Contains Stairway to Heaven",
      "tracks": "Black Dog|Rock and Roll|The Battle of Evermore|Stairway to Heaven|Misty Mountain Hop|Four Sticks|Going to California|When the Levee Breaks"
    },
    {
      "title": "It Takes a Nation of Millions to Hold Us Back",
      "artist": "Public Enemy",
      "year": 1988,
      "genre": "hip hop, political hip hop",
      "rating": 89,
      "coverUrl": "https://picsum.photos/id/124/300/300",
      "description": "Revolutionary hip hop",
      "tracks": "Countdown to Armageddon|Bring the Noise|Don't Believe the Hype|Cold Lampin' with Flavor|Terminator X to the Edge of Panic|Mind Terrorist|Louder Than a Bomb|Caught, Can We Get a Witness?|Show 'Em Whatcha Got|She Watch Channel Zero?!|Night of the Living Baseheads|Black Steel in the Hour of Chaos|Rebel Without a Pause|Prophets of Rage"
    },
    {
      "title": "The Stone Roses",
      "artist": "The Stone Roses",
      "year": 1989,
      "genre": "indie rock, baggy",
      "rating": 88,
      "coverUrl": "https://picsum.photos/id/133/300/300",
      "description": "The birth of Madchester",
      "tracks": "I Wanna Be Adored|She Bangs the Drums|Elephant Stone|Waterfall|Don't Stop|Bye Bye Badman|Sugar Spun Sister|Made of Stone|Shoot You Down|This Is the One|I Am the Resurrection|Fools Gold"
    },
    {
      "title": "Disintegration",
      "artist": "The Cure",
      "year": 1989,
      "genre": "gothic rock, post-punk",
      "rating": 87,
      "coverUrl": "https://picsum.photos/id/142/300/300",
      "description": "The Cure's gothic masterpiece",
      "tracks": "Plainsong|Pictures of You|Closedown|Lovesong|Last Dance|Lullaby|Fascination Street|Prayers for Rain|The Same Deep Water as You|Disintegration|Homesick|Untitled"
    },
    {
      "title": "Doolittle",
      "artist": "Pixies",
      "year": 1989,
      "genre": "alternative rock, indie rock",
      "rating": 86,
      "coverUrl": "https://picsum.photos/id/151/300/300",
      "description": "Influential alternative rock",
      "tracks": "Debaser|Tame|Wave of Mutilation|I Bleed|Here Comes Your Man|Dead|Monkey Gone to Heaven|Mr. Grieves|Crackity Jones|La La Love You|No. 13 Baby|There Goes My Gun|Hey|Silver|Gouge Away"
    },
    {
      "title": "Marquee Moon",
      "artist": "Television",
      "year": 1977,
      "genre": "art punk, post-punk",
      "rating": 85,
      "coverUrl": "https://picsum.photos/id/160/300/300",
      "description": "Guitar rock perfection",
      "tracks": "See No Evil|Venus|Friction|Marquee Moon|Elevation|Guiding Light|Prove It|Torn Curtain"
    },
    {
      "title": "Transformer",
      "artist": "Lou Reed",
      "year": 1972,
      "genre": "glam rock, art rock",
      "rating": 84,
      "coverUrl": "https://picsum.photos/id/169/300/300",
      "description": "Walk on the Wild Side",
      "tracks": "Vicious|Andy's Chest|Perfect Day|Hangin' Round|Walk on the Wild Side|Make Up|Satellite of Love|Wagon Wheel|New York Telephone Conversation|I'm So Free|Goodnight Ladies"
    },
    {
      "title": "Harvest",
      "artist": "Neil Young",
      "year": 1972,
      "genre": "folk rock, country rock",
      "rating": 83,
      "coverUrl": "https://picsum.photos/id/178/300/300",
      "description": "Young's commercial peak",
      "tracks": "Out on the Weekend|Harvest|A Man Needs a Maid|Heart of Gold|Are You Ready for the Country?|Old Man|There's a World|Alabama|The Needle and the Damage Done|Words (Between the Lines of Age)"
    },
    {
      "title": "Is This It",
      "artist": "The Strokes",
      "year": 2001,
      "genre": "indie rock, garage rock",
      "rating": 82,
      "coverUrl": "https://picsum.photos/id/187/300/300",
      "description": "Revived garage rock in the 2000s",
      "tracks": "Is This It|The Modern Age|Soma|Barely Legal|Someday|Alone, Together|Last Nite|Hard to Explain|When It Started|Trying Your Luck|Take It or Leave It"
    },
    {
      "title": "Bitches Brew",
      "artist": "Miles Davis",
      "year": 1970,
      "genre": "jazz fusion, experimental",
      "rating": 81,
      "coverUrl": "https://picsum.photos/id/196/300/300",
      "description": "The birth of jazz fusion",
      "tracks": "Pharaoh's Dance|Bitches Brew|Spanish Key|John McLaughlin|Miles Runs the Voodoo Down|Sanctuary"
    },
    {
      "title": "Spiderland",
      "artist": "Slint",
      "year": 1991,
      "genre": "post-rock, math rock",
      "rating": 80,
      "coverUrl": "https://picsum.photos/id/11/300/300",
      "description": "The blueprint for post-rock",
      "tracks": "Breadcrumb Trail|Nosferatu Man|Don, Aman|Washer|For Dinner...|Good Morning, Captain"
    },
    {
      "title": "Daydream Nation",
      "artist": "Sonic Youth",
      "year": 1988,
      "genre": "noise rock, alternative rock",
      "rating": 79,
      "coverUrl": "https://picsum.photos/id/29/300/300",
      "description": "Noise rock's finest hour",
      "tracks": "Teen Age Riot|Silver Rocket|The Sprawl|Cross the Breeze|Eric's Trip|Total Trash|Hey Joni|Providence|Candle|Rain King|Kissability|Trilogy: a) The Wonder|Trilogy: b) Hyperstation|Trilogy: z) Eliminator Jr."
    },
    {
      "title": "The Low End Theory",
      "artist": "A Tribe Called Quest",
      "year": 1991,
      "genre": "hip hop, jazz rap",
      "rating": 78,
      "coverUrl": "https://picsum.photos/id/38/300/300",
      "description": "Jazz rap perfection",
      "tracks": "Excursions|Buggin' Out|Rap Promoter|Butter|Verses from the Abstract|Show Business|Vibes and Stuff|The Infamous Date Rape|Check the Rhime|Everything Is Fair|Jazz (We've Got)|Skypager|What?|Scenario"
    },
    {
      "title": "Horses",
      "artist": "Patti Smith",
      "year": 1975,
      "genre": "punk rock, art punk",
      "rating": 77,
      "coverUrl": "https://picsum.photos/id/47/300/300",
      "description": "The birth of punk poetry",
      "tracks": "Gloria|Redondo Beach|Birdland|Free Money|Kimberly|Break It Up|Land|Elegie"
    },
    {
      "title": "Selected Ambient Works 85-92",
      "artist": "Aphex Twin",
      "year": 1992,
      "genre": "ambient, electronic",
      "rating": 76,
      "coverUrl": "https://picsum.photos/id/55/300/300",
      "description": "Ambient electronica classic",
      "tracks": "Xtal|Tha|Pulsewidth|Ageispolis|i|Green Calx|Heliosphan|We Are the Music Makers|Schottkey 7th Path|Ptolemy|Hedphelym|Delphium|Actium"
    },
    {
      "title": "Grace",
      "artist": "Jeff Buckley",
      "year": 1994,
      "genre": "alternative rock, folk rock",
      "rating": 75,
      "coverUrl": "https://picsum.photos/id/66/300/300",
      "description": "A voice from the heavens",
      "tracks": "Mojo Pin|Grace|Last Goodbye|Lilac Wine|So Real|Hallelujah|Lover, You Should've Come Over|Corpus Christi Carol|Eternal Life|Dream Brother"
    },
    {
      "title": "Electric Ladyland",
      "artist": "Jimi Hendrix",
      "year": 1968,
      "genre": "psychedelic rock, blues rock",
      "rating": 74,
      "coverUrl": "https://picsum.photos/id/74/300/300",
      "description": "Hendrix at his peak",
      "tracks": "And the Gods Made Love|Have You Ever Been (To Electric Ladyland)|Crosstown Traffic|Voodoo Chile|Little Miss Strange|Long Hot Summer Night|Come On (Let the Good Times Roll)|Gypsy Eyes|Burning of the Midnight Lamp|Rainy Day, Dream Away|1983... (A Merman I Should Turn to Be)|Moon, Turn the Tides... Gently Gently Away|Still Raining, Still Dreaming|House Burning Down|All Along the Watchtower|Voodoo Child (Slight Return)"
    },
    {
      "title": "Closer",
      "artist": "Joy Division",
      "year": 1980,
      "genre": "post-punk, gothic rock",
      "rating": 73,
      "coverUrl": "https://picsum.photos/id/83/300/300",
      "description": "A dark, haunting farewell",
      "tracks": "Atrocity Exhibition|Isolation|Passover|Colony|A Means to an End|Heart and Soul|Twenty Four Hours|The Eternal|Decades"
    },
    {
      "title": "Blue Lines",
      "artist": "Massive Attack",
      "year": 1991,
      "genre": "trip hop, electronic",
      "rating": 72,
      "coverUrl": "https://picsum.photos/id/92/300/300",
      "description": "The birth of trip hop",
      "tracks": "Safe from Harm|One Love|Blue Lines|Be Thankful for What You've Got|Five Man Army|Unfinished Sympathy|Daydreaming|Lately|Hymn of the Big Wheel"
    },
    {
      "title": "Rumours",
      "artist": "Fleetwood Mac",
      "year": 1977,
      "genre": "pop rock, soft rock",
      "rating": 71,
      "coverUrl": "https://picsum.photos/id/101/300/300",
      "description": "Breakup album perfection",
      "tracks": "Second Hand News|Dreams|Never Going Back Again|Don't Stop|Go Your Own Way|Songbird|The Chain|You Make Loving Fun|I Don't Want to Know|Oh Daddy|Gold Dust Woman"
    },
    {
      "title": "Entertainment!",
      "artist": "Gang of Four",
      "year": 1979,
      "genre": "post-punk, funk",
      "rating": 70,
      "coverUrl": "https://picsum.photos/id/110/300/300",
      "description": "Political post-punk",
      "tracks": "Ether|Natural's Not in It|Not Great Men|Damaged Goods|Return the Gift|Guns Before Butter|I Found That Essence Rare|To Hell With Poverty!|Why Theory?|Anthrax|Mannequin|Contract|At Home He's a Tourist|5.45|Love Like Anthrax"
    },
    {
      "title": "Homogenic",
      "artist": "Bjork",
      "year": 1997,
      "genre": "electronic, art pop",
      "rating": 69,
      "coverUrl": "https://picsum.photos/id/121/300/300",
      "description": "Icelandic electronic perfection",
      "tracks": "Hunter|Jóga|Unravel|Bachelorette|All Neon Like|5 Years|Immature|Alarm Call|Pluto|All Is Full of Love"
    }
  ];

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
  console.log('[导入数据] 模式:', clear ? '清空模式' : '智能模式');

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
            // 已存在则更新
            await db.collection('albums').doc(existingId).update({
              data: { ...album, updateTime: db.serverDate() }
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
