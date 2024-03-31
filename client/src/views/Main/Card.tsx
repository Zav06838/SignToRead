import React from "react";
import "./Main.css";

interface CardProps {
  text: string;
  image: string; // Add image prop
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ text, image, onClick }) => {
  return (
    <div
      className="card bg-slate-200 shadow-md hover:bg-slate-300 dark:bg-[#1e1f20] dark:hover:bg-white dark:hover:bg-opacity-20"
      onClick={onClick}
      data-testid="card"
    >
      <p className="text-[#1e1f20] dark:text-[#ffffff]">{text}</p>
      <img src={image} alt="" className="bg-white dark:bg-[#111111]" />
    </div>
  );
};

export default Card;
