'use client'

export default function AmbientOrbs() {
  const orbs = [
    { x: '15%', y: '20%', size: 300, color: '#EEEDFE', duration: 18 },
    { x: '70%', y: '60%', size: 200, color: '#E1F5EE', duration: 22 },
    { x: '40%', y: '75%', size: 250, color: '#EEEDFE', duration: 16 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            opacity: 0.4,
            filter: 'blur(60px)',
            animation: `orbDrift ${orb.duration}s ease-in-out ${i * 3}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}
