import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import './PlaceOrderButton.css';

gsap.registerPlugin(MotionPathPlugin, MorphSVGPlugin, DrawSVGPlugin);

const PlaceOrderButton = ({ onClick, isLoading, disabled }) => {
  const [hasRun, setHasRun] = useState(false);
  
  const svgRef = useRef(null);
  const baseRef = useRef(null); 
  const btnBaseRef = useRef(null); 
  const txtSendRef = useRef(null);
  const paperPlaneRef = useRef(null);
  const paperPlanePathRef = useRef(null);
  const paperPlaneRouteRef = useRef(null);
  const rectSentItemsRef = useRef(null);
  const mask1Ref = useRef(null);
  
  const cBottomRef = useRef(null);
  const cTopRef = useRef(null);
  const cCenterRef = useRef(null);
  const cEndRef = useRef(null);
  const tickMarkRef = useRef(null);

  useEffect(() => {

    const newBtnBase = MorphSVGPlugin.convertToPath(btnBaseRef.current)[0];
    btnBaseRef.current = newBtnBase;
    
    MorphSVGPlugin.convertToPath([cBottomRef.current, cTopRef.current, cCenterRef.current, cEndRef.current]);
    
    gsap.set(paperPlaneRouteRef.current, { drawSVG: "0% 0%" });
    gsap.set(rectSentItemsRef.current, { x: "-=240" });
    
  }, []);

  const handleMouseDown = () => {
    if (disabled || isLoading || hasRun) return;
    gsap.to(baseRef.current, { duration: 0.1, scale: 0.9, transformOrigin: "50% 50%" });
  };

  const handleMouseUp = (e) => {
    if (disabled || isLoading) return;
    
    if (hasRun) {
        return; 
    }

    setHasRun(true);
    
    gsap.to(baseRef.current, { duration: 0.2, scale: 1, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
             if (onClick) onClick(e);
        }, 500);
      }
    });

    tl.to(
        btnBaseRef.current,
        { duration: 0.77, morphSVG: cBottomRef.current, ease: "power1.inOut" },
        "start"
    );

    tl.to(btnBaseRef.current, { duration: 0.23, morphSVG: cTopRef.current, ease: "power1.inOut" });
    tl.to(btnBaseRef.current, {
        duration: 0.2,
        morphSVG: cCenterRef.current,
        ease: "power1.inOut"
    });
    tl.to(
        btnBaseRef.current,
        { duration: 0.5, morphSVG: cEndRef.current, ease: "power1.inOut" },
        "revealStart"
    );
    tl.to(rectSentItemsRef.current, { x: "0", duration: 0.5 }, "revealStart");
    tl.to(
        mask1Ref.current,
        { attr: { x: "-=260" }, duration: 0.5, ease: "power1.inOut" },
        "revealStart"
    );
    tl.to(
        paperPlaneRef.current,
        { x: "-=205", duration: 0.5, ease: "power1.inOut" },
        "revealStart"
    );
    tl.to(
        paperPlanePathRef.current,
        { duration: 0.43, morphSVG: tickMarkRef.current },
        "start+=0.77"
    );

    tl.to(
        txtSendRef.current,
        { duration: 0.6, scale: 0, transformOrigin: "50% 50%" },
        "start"
    );
    tl.to(
        paperPlaneRouteRef.current,
        { drawSVG: "80% 100%", duration: 0.7, ease: "power1.inOut" },
        "start+=0.3"
    );
    tl.to(
        paperPlaneRouteRef.current,
        { drawSVG: "100% 100%", duration: 0.2, ease: "power1.inOut" },
        "start+=1"
    );

    tl.to(
        paperPlaneRef.current,
        {
            duration: 1,
            ease: "power1.inOut",
            immediateRender: true,
            motionPath: {
                path: paperPlaneRouteRef.current,
                align: paperPlaneRouteRef.current,
                alignOrigin: [0.5, 0.5],
                autoRotate: 90
            }
        },
        "start"
    );

    tl.to(
        paperPlanePathRef.current,
        { duration: 0.15, attr: { fill: "#718096" } },
        "start"
    );
    tl.to(
        paperPlanePathRef.current,
        { duration: 0.15, attr: { fill: "#718096" } },
        "start+=0.77"
    );
  };

  return (
    <div className="placeOrderButtonContainer">
      <svg viewBox="0 0 1400 1080" fill="none" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
        <path id="paperPlaneRoute" ref={paperPlaneRouteRef} d="M563.558,526.618 C638.854,410.19 787.84,243.065 916.53,334.949 1041.712,424.328 858.791,877.927 743.926,856.655 642.241,838.669 699.637,688.664 700,540" stroke="white" strokeWidth="3" style={{strokeDashoffset: "0.001px", strokeDasharray: "0px, 999999px"}}/>
        
        <g id="rectSent" clipPath="url(#clipPath)">
            <g id="rectSentItems" ref={rectSentItemsRef}>
                <rect id="sentBase" x="460" y="468.5" width="480" height="143" rx="23" fill="white"/>
                <text id="txtSent" fill="#000000" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Roboto" fontSize="82" fontWeight="bold" letterSpacing="0.025em"><tspan x="637.487" y="568.027">Ordered</tspan></text>
            </g>
        </g>
        
        <g id="base" ref={baseRef} style={{cursor: 'pointer'}} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}>
            <g filter="url(#flShadow)">
                <rect id="btnBase" ref={btnBaseRef} x="418.117" y="460.55" width="563.765" height="158.899" rx="27" fill="#F1F3FF" />
            </g>
            <text id="txtSend" ref={txtSendRef} fill="#291D89" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Roboto" fontSize="82" fontWeight="bold" letterSpacing="0.06em"><tspan x="679.379" y="568.027">Order</tspan></text>
            <g id="paperPlane" ref={paperPlaneRef} style={{transformOrigin: "0px 0px 0px"}} data-svg-origin="563.55859375 527.734375" transform="matrix(0.8396,0.5432,-0.5432,0.8396,377.09924,-222.6639)">
                <path id="paperPlanePath" ref={paperPlanePathRef} d="M560.611 481.384C562.003 479.263 565.113 479.263 566.505 481.384L607.063 543.177C615.657 556.272 607.507 573.375 592.766 575.676L566.422 557.462V510.018C566.422 508.436 565.14 507.154 563.558 507.154C561.976 507.154 560.693 508.436 560.693 510.018V557.462L534.349 575.676C519.609 573.375 511.459 556.272 520.053 543.177L560.611 481.384Z" fill="#4F67EB"/>
            </g>
        </g>
        
        <circle id="cBottom" ref={cBottomRef} cx="700" cy="540" r="97.516" fill="#C23F3F" className="hidden"/>
        <circle id="cTop" ref={cTopRef} cx="700" cy="502.365" r="107.898" fill="#C23F3F" className="hidden"/>
        <circle id="cCenter" ref={cCenterRef} cx="700" cy="540" r="123" fill="#A74C4C" className="hidden" />
        <circle id="cEnd" ref={cEndRef} cx="495" cy="540" r="98" fill="#F1F3FF" className="hidden"/>
        
        <path id="tickMark" ref={tickMarkRef} fillRule="evenodd" clipRule="evenodd" d="M597.3 489.026C595.179 487.257 592.026 487.541 590.257 489.662L550.954 536.768L534.647 522.965C532.539 521.181 529.384 521.444 527.6 523.551L519.096 533.598C517.312 535.706 517.575 538.861 519.682 540.645L538.606 556.662C538.893 557.162 539.272 557.621 539.74 558.012L549.847 566.445C551.967 568.214 555.12 567.929 556.889 565.809L608.042 504.501C609.811 502.38 609.527 499.227 607.406 497.458L597.3 489.026Z" fill="#4E67E8" className="hidden"/>
        
        <defs>
            <clipPath id="clipPath">
            <rect id="mask1" ref={mask1Ref} x="700" y="450" width="520" height="180" fill="white" />
            </clipPath>
            <filter id="flShadow" x="0" y="0" width="1000" height="1000" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
            <feOffset dx="4" dy="4"/>
            <feGaussianBlur stdDeviation="3.5"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.5125 0 0 0 0 0.420677 0 0 0 0 0.420677 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
        </defs>
      </svg>
    </div>
  );
};

export default PlaceOrderButton;
