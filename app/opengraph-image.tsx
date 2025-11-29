import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Braina - AI Learning Platform';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #111827, #000000)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}
                >
                    {/* Logo simulé ou icône */}
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#A855F7" // Purple-500
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                    <h1
                        style={{
                            fontSize: '80px',
                            fontWeight: 'bold',
                            color: 'white',
                            marginLeft: '20px',
                            letterSpacing: '-0.05em',
                        }}
                    >
                        BRAINA
                    </h1>
                </div>
                <p
                    style={{
                        fontSize: '32px',
                        color: '#9CA3AF', // Gray-400
                        textAlign: 'center',
                        maxWidth: '800px',
                        lineHeight: 1.4,
                    }}
                >
                    Transformez vos documents en Quiz, Flashcards et Podcasts grâce à l'IA.
                </p>
                <div
                    style={{
                        marginTop: '40px',
                        padding: '12px 30px',
                        background: '#A855F7', // Purple-500
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                    }}
                >
                    Commencer gratuitement
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
