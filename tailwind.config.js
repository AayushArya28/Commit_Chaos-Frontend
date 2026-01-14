/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // GLOBAL / UTILITY (Login, Contact, FAQ)
                global: {
                    indigo: '#3F51B5',
                    bg: '#F4F7F9',
                    surface: '#FFFFFF',
                    text: '#1A1C1E',
                    muted: '#6C757D',
                    success: '#00C896',
                    error: '#E63946',
                },
                // TROPICAL (Beaches, Islands)
                tropical: {
                    ocean: '#0077B6',
                    sky: '#90E0EF',
                    sand: '#FDF0D5',
                    coral: '#F25C54',
                    navy: '#03045E',
                },
                // ALPINE (Mountains, Trekking)
                alpine: {
                    forest: '#2D6A4F',
                    slate: '#4A4E69',
                    earth: '#8C7851',
                    snow: '#F8F9FA',
                    orange: '#FF8800',
                },
                // HERITAGE (Culture, History)
                heritage: {
                    burgundy: '#632626',
                    gold: '#D4AF37',
                    parchment: '#F5F1E3',
                    charcoal: '#333533',
                    olive: '#403D39',
                },
                // URBAN (Metropolis, Nightlife)
                urban: {
                    purple: '#7209B7',
                    blue: '#4361EE',
                    midnight: '#1B1B1B',
                    pink: '#F72585',
                    cloud: '#E5E5E5',
                },
            },
        },
    },
    plugins: [],
}