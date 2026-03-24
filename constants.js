export const paintings = [
    {
        id: 1,
        title: "Eternal Azure",
        category: "abstract",
        artist: "Eleanor Vance",
        price: 2400,
        image: "/images/abstract_1.png",
        description: "A deep dive into the textured depths of midnight blue, accented with shimmering gold leaf. This piece explores the boundary between order and chaos."
    },
    {
        id: 2,
        title: "Mountain Whisper",
        category: "nature",
        artist: "Julian Thorne",
        price: 1850,
        image: "/images/landscape_1.png",
        description: "Soft sunrise tones capturing the fleeting mist of the High Sierras in early spring. Thorne's brushwork emphasizes the ephemeral nature of light."
    },
    {
        id: 3,
        title: "Nocturne Glow",
        category: "expressionism",
        artist: "Eliza K.",
        price: 3200,
        image: "/images/portrait_1.png",
        description: "A bold expressionist portrait blending street-art energy with classical chiaroscuro. A statement of identity in the modern age."
    },
    {
        id: 4,
        title: "Verdant Echo",
        category: "nature",
        artist: "Marcus Reed",
        price: 2100,
        image: "/images/nature_1.png",
        description: "Hyper-realistic study of light filtering through a dense rainforest canopy. An ode to the quiet majesty of the ancient woods."
    },
    {
        id: 5,
        title: "Gilded Chaos",
        category: "abstract",
        artist: "Eleanor Vance",
        price: 2800,
        image: "/images/abstract_2.png",
        description: "Vibrant emerald and charcoal collide in this high-energy abstract piece. Gold leaf splatters represent the sparks of creation."
    },
    {
        id: 6,
        title: "Rainy Boulevard",
        category: "expressionism",
        artist: "Sacha Rossi",
        price: 3500,
        image: "/images/expressionism_1.png",
        description: "The city comes alive under an evening rain. Rossi's thick, impasto strokes capture the rhythm of urban life and neon reflections."
    }
];

export const artists = [
    {
        name: "Eleanor Vance",
        role: "Abstract Visionary",
        image: "/images/portrait_1.png",
        bio: "Specializing in large-scale textured abstracts, Eleanor's work is held in private collections across Europe."
    },
    {
        name: "Julian Thorne",
        role: "Landscape Master",
        image: "/images/landscape_1.png",
        bio: "Julian captures the raw essence of nature through his unique 'mist-layering' oil technique."
    },
    {
        name: "Sacha Rossi",
        role: "Urban Expressionist",
        image: "/images/expressionism_1.png",
        bio: "Rossi's vibrant cityscapes explore the intersection of light, rain, and human movement."
    }
];

export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

export const ANIMATION_CONFIG = {
    DURATION: 0.6,
    STAGGER: 0.1,
    THRESHOLD: 0.2
};
