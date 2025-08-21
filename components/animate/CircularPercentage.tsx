import React from "react";

export default function CircularPercentage({
    title,
    value,
    strokeWidth = 10,
    trackColor = "var(--shade2)",
    progressColor = "var(--c1)",
}: {
    title?: string;
    value: number;
    strokeWidth?: number;
    trackColor?: string;
    progressColor?: string;
}) {
    const pct = Math.max(0, Math.min(100, value));

    const size = 100;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - pct / 100);
    const center = size / 2;

    return (
        <div className="container" style={{ width: "100%", color: "var(--textC4)", justifyItems: "center" }}>
            {title !== undefined && (
                <h5 style={{ textAlign: "center" }}>{title}</h5>
            )}

            <div style={{ width: "100%", aspectRatio: "1/1", position: "relative", justifySelf: "stretch" }}>
                <svg style={{ width: "auto", height: "auto" }}
                    viewBox={`0 0 ${size} ${size}`}
                    className="block w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <circle //track
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={trackColor}
                        strokeWidth={strokeWidth / 2}
                    />

                    <circle //progress
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        transform={`rotate(-90 ${center} ${center})`}
                    />
                </svg>

                <div className="resetTextMargin flexContainer" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", gap: "0rem" }}>
                    <p style={{ color: "inherit", fontSize: "var(--fontSizeM)", fontWeight: 500 }}>{pct}</p>

                    <span className="highlightText" style={{ fontSize: "var(--fontSizeS)" }}>%</span>
                </div>
            </div>
        </div>
    );
}