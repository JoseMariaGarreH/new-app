"use client";

// Componentes
import AjaxLoader from "@/components/ui/AjaxLoader";
// Hooks
import { useState, useRef, useCallback, useEffect } from "react";
import { useAvatar } from "@/hooks/useAvatar";
import { useProfileById } from "@/hooks/useProfileById";
import { useSession } from "next-auth/react";
//Next.js
import Image from "next/image";
// Utils
import { getCroppedImg } from "@/src/utils/cropImage";
// Librerías
import Cropper from "react-easy-crop";
import toast, { Toaster } from "react-hot-toast";

const DEFAULT_AVATAR_URL = "https://res.cloudinary.com/dyczqjlew/image/upload/v1747501573/jybzlcwtyskmwk3azgxu.jpg";

export default function AvatarUploader() {

    // Obtiene la sesión del usuario actual
    const { data: session } = useSession();

    // Hooks personalizados para obtener el perfil y manejar el avatar
    const { profile } = useProfileById(session?.user?.id || "");
    const { updateAvatar, deleteAvatar, loading } = useAvatar(session?.user?.id || "");

    // Estados para manejar la imagen, recorte y zoom
    const [preview, setPreview] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    // Efecto para cargar la imagen del perfil si existe y no se ha interactuado aún
    useEffect(() => {
        if (profile?.profileImage && !hasInteracted) {
            setPreview(profile.profileImage);
            setCroppedImage(profile.profileImage);
        }
    }, [profile?.profileImage, hasInteracted]);

    // Maneja la eliminación del avatar, restableciendo el estado y eliminando la imagen
    const handleDeleteAvatar = async () => {
        setPreview(DEFAULT_AVATAR_URL);
        setCroppedImage(DEFAULT_AVATAR_URL);
        setImageName(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        await deleteAvatar(DEFAULT_AVATAR_URL);
        window.location.reload();
    };

    // Maneja el cambio de archivo (cuando el usuario selecciona una imagen)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setHasInteracted(true);
            setImageName(file.name);
            setCroppedImage(null);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else if (file) {
            toast.error("El archivo seleccionado no es una imagen válida.");
        }
        e.target.value = "";
    };

    // Se ejecuta cuando el usuario termina de ajustar el recorte
    const onCropComplete = useCallback((_: any, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Cambia showCroppedImage para subir la imagen al confirmar el recorte
    const showCroppedImage = useCallback(async () => {
        if (!preview || !croppedAreaPixels || !imageName || !session) return;
        try {
            const croppedImg = await getCroppedImg(preview, croppedAreaPixels);

            let fileToUpload: File | string;
            if (croppedImg instanceof Blob) {
                fileToUpload = new File([croppedImg], imageName, { type: croppedImg.type });
            } else {
                // Si por alguna razón getCroppedImg devuelve string (no debería), se maneja igual
                fileToUpload = croppedImg;
            }

            const url = await updateAvatar(fileToUpload);

            if (url) {
                setPreview(url);
                setCroppedImage(url);
                window.location.reload();
            }
        } catch (error) {
            toast.error("Error al guardar el avatar");
        }
    }, [preview, croppedAreaPixels, imageName, session]);

    // Maneja el evento de arrastre dentro del área de recorte
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    // Maneja el evento de arrastre fuera del área de recorte
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    // Maneja el lanzamiento de archivos hacia el área de recorte
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setHasInteracted(true);
            setPreview(null);
            setCroppedImage(null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setImageName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }else{
            toast.error("El archivo arrastrado no es una imagen válida.");
        }
    };

    // Previene el comportamiento por defecto al arrastrar sobre el área
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="max-w-2xl mt-32 mb-32 mx-auto p-6 bg-[#1d3557] rounded-lg shadow-lg text-white">
                <h2 className="text-xl font-semibold mb-4">Avatar</h2>
                <div
                    className={
                        "relative w-full h-96 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200" +
                        (isDragActive ? " border-blue-400 bg-blue-100/10" : "")
                    }
                    onClick={() => {
                        if (!preview && !croppedImage) {
                            fileInputRef.current?.click();
                        }
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                >
                    {/* Si hay preview pero no imagen recortada, muestra el cropper */}
                    {
                        loading ? (
                            <AjaxLoader />
                        ) : preview && !croppedImage ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-60 h-60 rounded-full overflow-hidden relative flex items-center justify-center border-4 border-white shadow-lg">
                                    <Cropper
                                        image={preview}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        cropShape="round"
                                        showGrid={false}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-48 h-2 rounded bg-[#a8dadc] outline-none accent-[#a8dadc] transition"
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-1.5 border border-white/30 hover:border-white hover:bg-blue-600 text-sm text-white font-medium rounded transition"
                                        onClick={showCroppedImage}
                                    >
                                        Guardar imagen
                                    </button>
                                    <button
                                        className="px-4 py-1.5 border border-white/30 hover:border-white hover:bg-red-600 text-sm text-white font-medium rounded transition"
                                        onClick={() => {
                                            setPreview(profile?.profileImage || DEFAULT_AVATAR_URL);
                                            setCroppedImage(profile?.profileImage || DEFAULT_AVATAR_URL);
                                            setImageName(null);
                                            setCrop({ x: 0, y: 0 });
                                            setZoom(1);
                                            setCroppedAreaPixels(null);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : croppedImage ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="rounded-full overflow-hidden flex items-center justify-center bg-[linear-gradient(45deg,#e0e0e0_25%,transparent_25%,transparent_75%,#e0e0e0_75%,#e0e0e0),linear-gradient(-45deg,#f8f8f8_25%,transparent_25%,transparent_75%,#f8f8f8_75%,#f8f8f8)] bg-[length:24px_24px] border-4 border-white shadow-lg">
                                    <Image
                                        src={croppedImage}
                                        width={180}
                                        height={180}
                                        alt="Avatar Preview"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        ) : (
                            // Si no hay imagen, muestra el mensaje para cargar una
                            <p>Arrastrar y soltar una imagen</p>
                        )}
                    {isDragActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-400/30 z-10 rounded-md pointer-events-none">
                            <span className="text-white text-lg font-bold">¡Suelta la imagen aquí!</span>
                        </div>
                    )}
                </div>
                {/* Input de archivo oculto */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                />
                <div className="flex gap-4 mt-4 justify-center">
                    <button
                        type="button"
                        className="px-4 py-1.5 border border-white/30 hover:border-white hover:bg-green-600 text-sm text-white font-medium rounded transition"
                        onClick={() => {
                            fileInputRef.current?.click();
                        }}
                    >
                        Seleccionar nueva imagen
                    </button>
                    <button
                        type="button"
                        className="px-4 py-1.5 border border-white/30 hover:border-white hover:bg-red-600 text-sm text-white font-medium rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDeleteAvatar}
                        disabled={
                            (!preview && !croppedImage) ||
                            profile?.profileImage === DEFAULT_AVATAR_URL
                        }
                    >
                        Borrar imagen
                    </button>
                </div>
            </div >
        </>
    );
}