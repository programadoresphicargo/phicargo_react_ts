import { Avatar, User } from "@heroui/react";
import { useAsset } from "./useAsset";

interface StepAvatarProps {
 imagen: string;
 color: any;
 bordered?: boolean;
 size?: "sm" | "md" | "lg";
}

interface StepUserProps {
 imagen: string;
 color: any;
 bordered?: boolean;
 size?: "sm" | "md" | "lg";
 name: string;
 description: string;
}

export const StepAvatar = ({ imagen, color, bordered = false, size = "sm" }: StepAvatarProps) => {
 const src = useAsset(imagen);

 return (
  <Avatar
   src={src}
   isBordered={bordered}
   size={size}
   radius="full"
   color={color}
   className="h-8 w-8"
   title="prueba"

  />
 );
};

export const StepUser = ({ imagen, color, bordered = false, size = "sm", name, description }: StepUserProps) => {
 const src = useAsset(imagen);

 return (
  <User
   avatarProps={{
    src: src,
    isBordered: bordered,
    size: size,
    color: color
   }}
   name={name}
   description={description}
  />
 );
};