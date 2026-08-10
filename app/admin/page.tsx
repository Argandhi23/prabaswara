"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Save,
  Settings,
  Grid,
  X,
  Crop,
  Layers,
  CheckCircle,
  Tag,
  Trash2,
  Edit3,
  Check,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Photo, Brand, SiteSettings, PackageItem, AdminToast as ToastType } from "@/types";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminGuideBanner from "@/components/admin/AdminGuideBanner";
import PhotoCard from "@/components/admin/PhotoCard";
import BrandCard from "@/components/admin/BrandCard";
import AdminToast from "@/components/admin/AdminToast";
import ImageCropperModal, { CropRatioType } from "@/components/admin/ImageCropperModal";

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "brands" | "packages" | "settings">("photos");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [packageCategoryFilter, setPackageCategoryFilter] = useState<string>("all");

  // Data States
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    company_name: "Prabaswara",
    tagline: "Photography & Creative Visual Studio",
    about_text: "",
    whatsapp_number: "6281234567890",
    default_whatsapp_message: "",
    address: "",
    email: "",
    instagram_url: "",
    youtube_url: "",
    camera_image_url: "",
    about_image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastType | null>(null);

  // Photo Modal State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // Brand Cover Modal State
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brandForm, setBrandForm] = useState({
    id: "",
    slug: "",
    title: "",
    tagline: "",
    coverImage: "",
  });

  // Package Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [packageForm, setPackageForm] = useState({
    id: "",
    brand_slug: "swara-studio",
    name: "",
    price: "",
    period: "",
    description: "",
    features: [] as string[],
    is_popular: false,
    popular_label: "PALING POPULER",
    wa_message: "",
    display_order: 0,
  });

  // Cropper Target ("photo" | "brand" | "settingCamera" | "settingAbout")
  const [cropperTarget, setCropperTarget] = useState<"photo" | "brand" | "settingCamera" | "settingAbout">("photo");
  const [modalMode, setModalMode] = useState<"form" | "crop">("form");

  // Cropper Controls State
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropRatio, setCropRatio] = useState<CropRatioType>("portrait");

  // Photo Form State
  const [photoForm, setPhotoForm] = useState({
    title: "",
    imageUrl: "",
    caption: "",
    brandSlug: "swara-gallery",
    brandTitle: "Swara Gallery",
    isFeatured: false,
    aspectRatio: "portrait",
    displayOrder: 0,
  });

  const router = useRouter();

  const showToastMsg = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Auth check & data fetching
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setAuthenticated(true);
          fetchData();
        }
      } catch {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  async function fetchData() {
    setLoading(true);
    try {
      const [resPhotos, resBrands, resPackages] = await Promise.all([
        fetch("/api/admin/photos"),
        fetch("/api/admin/brands"),
        fetch("/api/admin/packages"),
      ]);
      const dataPhotos = await resPhotos.json();
      const dataBrands = await resBrands.json();
      const dataPackages = await resPackages.json();

      if (dataPhotos.photos) setPhotos(dataPhotos.photos);
      if (dataBrands.brands) setBrands(dataBrands.brands);
      if (dataPackages.packages) setPackages(dataPackages.packages);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  // Step 1: Select File for Photo, Brand, or Settings Image
  const handleSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "photo" | "brand" | "settingCamera" | "settingAbout"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropperTarget(target);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setCropperSrc(reader.result as string);
        setCropRatio(target === "brand" ? "banner" : "portrait");
        setModalMode("crop");
      }
    };
    reader.readAsDataURL(file);
  };

  // Step 2: Receive Cropped Blob & Upload
  const handleCropComplete = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, `cropped-${Date.now()}.webp`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await res.json();

      if (!res.ok) throw new Error(uploadResult.error || "Gagal mengunggah gambar.");

      if (cropperTarget === "photo") {
        setPhotoForm((prev) => ({
          ...prev,
          imageUrl: uploadResult.url,
          aspectRatio: cropRatio === "free" ? "portrait" : cropRatio,
        }));
      } else if (cropperTarget === "brand") {
        setBrandForm((prev) => ({
          ...prev,
          coverImage: uploadResult.url,
        }));
      } else if (cropperTarget === "settingCamera") {
        setSettings((prev) => ({
          ...prev,
          camera_image_url: uploadResult.url,
        }));
      } else if (cropperTarget === "settingAbout") {
        setSettings((prev) => ({
          ...prev,
          about_image_url: uploadResult.url,
        }));
      }

      showToastMsg("Gambar baru berhasil di-crop & diunggah!", "success");
      setCropperSrc(null);
      setModalMode("form");
      if (cropperTarget === "settingCamera" || cropperTarget === "settingAbout") {
        setShowPhotoModal(false);
      }
    } catch (err: any) {
      showToastMsg(err.message || "Gagal memproses crop gambar", "error");
    }
  };

  // Save Photo Record
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.imageUrl) {
      showToastMsg("Judul dan Gambar wajib diisi!", "error");
      return;
    }

    try {
      const method = editingPhoto ? "PUT" : "POST";
      const payload = editingPhoto
        ? { id: editingPhoto.id, ...photoForm }
        : photoForm;

      const res = await fetch("/api/admin/photos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan foto");

      showToastMsg(
        editingPhoto ? "Foto & Caption berhasil diperbarui!" : "Foto baru berhasil disimpan!",
        "success"
      );
      setShowPhotoModal(false);
      resetPhotoForm();
      fetchData();
      router.refresh();
    } catch (err: any) {
      showToastMsg(err.message || "Terjadi kesalahan", "error");
    }
  };

  // Save Brand Cover Image
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.slug || !brandForm.coverImage) {
      showToastMsg("Pilih Cover Image baru terlebih dahulu!", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan cover brand");

      showToastMsg(`Cover banner untuk ${brandForm.title} berhasil diperbarui!`, "success");
      setShowBrandModal(false);
      fetchData();
      router.refresh();
    } catch (err: any) {
      showToastMsg(err.message || "Terjadi kesalahan", "error");
    }
  };

  // Save Package Record
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.name || !packageForm.price || !packageForm.brand_slug) {
      showToastMsg("Nama Paket, Harga, dan Kategori Sub-Brand wajib diisi!", "error");
      return;
    }

    try {
      const method = editingPackage ? "PUT" : "POST";
      const payload = editingPackage
        ? packageForm
        : {
            brand_slug: packageForm.brand_slug,
            name: packageForm.name,
            price: packageForm.price,
            period: packageForm.period,
            description: packageForm.description,
            features: packageForm.features,
            is_popular: packageForm.is_popular,
            popular_label: packageForm.popular_label,
            wa_message: packageForm.wa_message,
            display_order: packageForm.display_order,
          };

      const res = await fetch("/api/admin/packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan paket harga");

      const savedPkg: PackageItem = data.package || {
        id: editingPackage ? editingPackage.id : `pkg-${Date.now()}`,
        ...payload,
      };

      if (editingPackage) {
        setPackages((prev) =>
          prev.map((p) => (p.id === savedPkg.id ? { ...p, ...savedPkg } : p))
        );
      } else {
        setPackages((prev) => [...prev, savedPkg]);
      }

      showToastMsg(
        editingPackage ? "Paket harga berhasil diperbarui!" : "Paket harga baru berhasil ditambahkan!",
        "success"
      );
      setShowPackageModal(false);
      fetchData();
      router.refresh();
    } catch (err: any) {
      showToastMsg(err.message || "Terjadi kesalahan saat menyimpan paket", "error");
    }
  };

  // Delete Package
  const handleDeletePackage = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket harga ini?")) return;

    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus paket harga");

      showToastMsg("Paket harga berhasil dihapus!", "success");
      fetchData();
      router.refresh();
    } catch (err: any) {
      showToastMsg(err.message || "Gagal menghapus paket", "error");
    }
  };

  // Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: settings.company_name,
          tagline: settings.tagline,
          aboutText: settings.about_text,
          whatsappNumber: settings.whatsapp_number,
          defaultWhatsappMessage: settings.default_whatsapp_message,
          address: settings.address,
          email: settings.email,
          instagramUrl: settings.instagram_url,
          youtubeUrl: settings.youtube_url,
          cameraImageUrl: settings.camera_image_url,
          aboutImageUrl: settings.about_image_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan pengaturan");

      showToastMsg("Pengaturan website & gambar About berhasil disimpan!", "success");
      router.refresh();
    } catch (err: any) {
      showToastMsg(err.message || "Terjadi kesalahan", "error");
    }
  };

  // Delete Photo Record
  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini dari website?")) return;

    try {
      const res = await fetch(`/api/admin/photos?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus foto");

      showToastMsg("Foto berhasil dihapus!", "success");
      fetchData();
      router.refresh();
    } catch (err: any) {
      showToastMsg(err.message || "Gagal menghapus foto", "error");
    }
  };

  const openAddPhotoModal = () => {
    resetPhotoForm();
    setEditingPhoto(null);
    setCropperTarget("photo");
    setModalMode("form");
    setShowPhotoModal(true);
  };

  const openEditPhotoModal = (photo: Photo) => {
    setEditingPhoto(photo);
    setCropperTarget("photo");
    setPhotoForm({
      title: photo.title,
      imageUrl: photo.image_url,
      caption: photo.caption || "",
      brandSlug: photo.brand_slug || "swara-gallery",
      brandTitle: photo.brand_title || "Swara Gallery",
      isFeatured: photo.is_featured,
      aspectRatio: photo.aspect_ratio || "portrait",
      displayOrder: photo.display_order || 0,
    });
    setModalMode("form");
    setShowPhotoModal(true);
  };

  const openEditBrandModal = (brand: Brand) => {
    setCropperTarget("brand");
    setBrandForm({
      id: brand.id,
      slug: brand.slug,
      title: brand.title,
      tagline: brand.tagline || "",
      coverImage: brand.cover_image,
    });
    setModalMode("form");
    setShowBrandModal(true);
  };

  const openAddPackageModal = () => {
    setEditingPackage(null);
    setPackageForm({
      id: "",
      brand_slug: packageCategoryFilter === "all" ? "swara-studio" : packageCategoryFilter,
      name: "",
      price: "Rp ",
      period: "/ sesi",
      description: "",
      features: [
        "1 Sesi Foto Studio / Outdoor",
        "Retouched HD Masterpiece Files",
        "All Softcopy Files (Google Drive)",
      ],
      is_popular: false,
      popular_label: "PALING POPULER",
      wa_message: "Halo Prabaswara, saya tertarik dengan paket ini.",
      display_order: packages.length + 1,
    });
    setModalMode("form");
    setShowPackageModal(true);
  };

  const openEditPackageModal = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setPackageForm({
      id: pkg.id,
      brand_slug: pkg.brand_slug || "swara-studio",
      name: pkg.name || "",
      price: pkg.price || "",
      period: pkg.period || "",
      description: pkg.description || "",
      features: Array.isArray(pkg.features) ? [...pkg.features] : [],
      is_popular: Boolean(pkg.is_popular),
      popular_label: pkg.popular_label || "PALING POPULER",
      wa_message: pkg.wa_message || "",
      display_order: pkg.display_order || 0,
    });
    setModalMode("form");
    setShowPackageModal(true);
  };

  const resetPhotoForm = () => {
    setPhotoForm({
      title: "",
      imageUrl: "",
      caption: "",
      brandSlug: "swara-gallery",
      brandTitle: "Swara Gallery",
      isFeatured: false,
      aspectRatio: "portrait",
      displayOrder: 0,
    });
    setCropperSrc(null);
  };

  const categoryOptions = [
    { slug: "swara-gallery", title: "Swara Gallery (Fotografi Seni & Fine Art)" },
    { slug: "swara-studio", title: "Swara Studio (Foto Studio, Portrait & Lookbook)" },
    { slug: "swara-moment", title: "Swara Moment (Dokumentasi Event & Selebrasi)" },
    { slug: "swara-wedding", title: "Swara Wedding (Foto Pernikahan & Momen Romantis)" },
  ];

  const brandNamesMap: Record<string, string> = {
    "swara-gallery": "Swara Gallery",
    "swara-studio": "Swara Studio",
    "swara-moment": "Swara Moment",
    "swara-wedding": "Swara Wedding",
  };

  const filteredPhotos = photos.filter((p) => {
    if (locationFilter === "all") return true;
    if (locationFilter === "featured") return p.is_featured;
    return p.brand_slug === locationFilter;
  });

  const filteredPackages = packages.filter((pkg) => {
    if (packageCategoryFilter === "all") return true;
    return pkg.brand_slug === packageCategoryFilter;
  });

  if (authenticated === null || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center font-sans-body">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#C9A961] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Memuat Dashboard Admin Prabaswara...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans-body">
      {/* Toast Alert */}
      <AdminToast toast={toast} />

      {/* Admin Header */}
      <AdminHeader onLogout={handleLogout} />

      {/* Main Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Guide Banner */}
        <AdminGuideBanner />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-4">
          <button
            onClick={() => setActiveTab("photos")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "photos"
                ? "bg-[#C9A961] text-neutral-950 shadow-md font-bold"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>1. Kelola Galeri Foto Karya ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("brands")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "brands"
                ? "bg-[#C9A961] text-neutral-950 shadow-md font-bold"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Kelola Banner 4 Sub-Brand ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "packages"
                ? "bg-[#C9A961] text-neutral-950 shadow-md font-bold"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>3. Kelola Paket Harga & Pricelist ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#C9A961] text-neutral-950 shadow-md font-bold"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>4. Gambar About & Kontak WA</span>
          </button>
        </div>

        {/* TAB 1: KELOLA FOTO GALERI */}
        {activeTab === "photos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-white">
                  Daftar Foto Portofolio
                </h2>
                <p className="text-xs text-neutral-400 font-light">
                  Klik **Edit Foto & Caption** pada foto mana saja di bawah untuk mengganti gambarnya dengan file baru.
                </p>
              </div>

              <button
                onClick={openAddPhotoModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Foto Baru</span>
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
              <span className="text-xs text-neutral-400 font-medium mr-2">Filter Berdasarkan Halaman:</span>
              <button
                onClick={() => setLocationFilter("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  locationFilter === "all"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                Semua Foto ({photos.length})
              </button>
              <button
                onClick={() => setLocationFilter("featured")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  locationFilter === "featured"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                🌟 Homepage Featured ({photos.filter((p) => p.is_featured).length})
              </button>
              <button
                onClick={() => setLocationFilter("swara-gallery")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  locationFilter === "swara-gallery"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                🖼️ Swara Gallery ({photos.filter((p) => p.brand_slug === "swara-gallery").length})
              </button>
              <button
                onClick={() => setLocationFilter("swara-studio")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  locationFilter === "swara-studio"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                📸 Swara Studio ({photos.filter((p) => p.brand_slug === "swara-studio").length})
              </button>
              <button
                onClick={() => setLocationFilter("swara-moment")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  locationFilter === "swara-moment"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                📅 Swara Moment ({photos.filter((p) => p.brand_slug === "swara-moment").length})
              </button>
              <button
                onClick={() => setLocationFilter("swara-wedding")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  locationFilter === "swara-wedding"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                💍 Swara Wedding ({photos.filter((p) => p.brand_slug === "swara-wedding").length})
              </button>
            </div>

            {/* Photos Grid */}
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800/80 space-y-4">
                <p className="text-sm text-neutral-400">Tidak ada foto untuk lokasi filter ini.</p>
                <button
                  onClick={openAddPhotoModal}
                  className="px-4 py-2 bg-[#C9A961] text-neutral-950 text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-[#B8964E] transition-all cursor-pointer"
                >
                  + Tambah Foto Baru
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onEdit={openEditPhotoModal}
                    onDelete={handleDeletePhoto}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KELOLA COVER BANNER 4 SUB-BRAND */}
        {activeTab === "brands" && (
          <div className="space-y-6">
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
              <h2 className="font-serif-heading text-xl font-bold text-white">
                Gambar Cover Banner 4 Sub-Brand Prabaswara
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-1">
                Ganti gambar utama/banner untuk Swara Gallery, Swara Studio, Swara Moment, dan Swara Wedding. Gambar ini yang tampil di Hero Showcase dan Halaman Layanan!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brands.map((brand) => (
                <BrandCard key={brand.id || brand.slug} brand={brand} onEdit={openEditBrandModal} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KELOLA PAKET HARGA & PRICELIST */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-white">
                  Kelola Pricelist & Paket Harga Sub-Brand
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Atur nama paket, daftar benefit/fasilitas, harga, label popularitas, dan kategori sub-brand. Perubahan akan langsung tampil di Beranda dan Halaman Kategori!
                </p>
              </div>

              <button
                onClick={openAddPackageModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Paket Baru</span>
              </button>
            </div>

            {/* Filter Buttons for Packages */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
              <span className="text-xs text-neutral-400 font-medium mr-2">Filter Kategori Sub-Brand:</span>
              <button
                onClick={() => setPackageCategoryFilter("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  packageCategoryFilter === "all"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                Semua Paket ({packages.length})
              </button>
              <button
                onClick={() => setPackageCategoryFilter("swara-gallery")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  packageCategoryFilter === "swara-gallery"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                🖼️ Swara Gallery ({packages.filter((p) => p.brand_slug === "swara-gallery").length})
              </button>
              <button
                onClick={() => setPackageCategoryFilter("swara-studio")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  packageCategoryFilter === "swara-studio"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                📸 Swara Studio ({packages.filter((p) => p.brand_slug === "swara-studio").length})
              </button>
              <button
                onClick={() => setPackageCategoryFilter("swara-moment")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  packageCategoryFilter === "swara-moment"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                📅 Swara Moment ({packages.filter((p) => p.brand_slug === "swara-moment").length})
              </button>
              <button
                onClick={() => setPackageCategoryFilter("swara-wedding")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  packageCategoryFilter === "swara-wedding"
                    ? "bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                💍 Swara Wedding ({packages.filter((p) => p.brand_slug === "swara-wedding").length})
              </button>
            </div>

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800/80 space-y-4">
                <p className="text-sm text-neutral-400">Belum ada paket harga untuk kategori ini.</p>
                <button
                  onClick={openAddPackageModal}
                  className="px-4 py-2 bg-[#C9A961] text-neutral-950 text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-[#B8964E] transition-all cursor-pointer"
                >
                  + Tambah Paket Baru
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col justify-between rounded-2xl p-6 bg-neutral-900 border transition-all ${
                      pkg.is_popular ? "border-[#C9A961] shadow-lg shadow-[#C9A961]/10" : "border-neutral-800"
                    }`}
                  >
                    {pkg.is_popular && (
                      <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-[#C9A961] text-neutral-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{pkg.popular_label || "POPULER"}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#C9A961]/15 text-[#C9A961] border border-[#C9A961]/30">
                          {brandNamesMap[pkg.brand_slug] || pkg.brand_slug}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Urutan: {pkg.display_order || 0}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif-heading text-lg font-bold text-white">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 min-h-[32px]">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-800 flex items-baseline gap-1">
                        <span className="font-serif-heading text-2xl font-bold text-[#C9A961]">
                          {pkg.price}
                        </span>
                        {pkg.period && (
                          <span className="text-xs text-neutral-400">{pkg.period}</span>
                        )}
                      </div>

                      {/* Benefits list */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                            Daftar Benefit ({pkg.features.length}):
                          </span>
                          <ul className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                            {pkg.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                                <Check className="w-3.5 h-3.5 text-[#C9A961] shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-6 mt-4 border-t border-neutral-800 flex items-center gap-2">
                      <button
                        onClick={() => openEditPackageModal(pkg)}
                        className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#C9A961]" />
                        <span>Edit Paket</span>
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-semibold transition-all cursor-pointer border border-red-800/50"
                        title="Hapus Paket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GAMBAR ABOUT & PENGATURAN KONTAK */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-8">
            {/* Section A: Gambar Section About Prabaswara */}
            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 space-y-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-white">
                  Gambar Section &quot;Tentang Prabaswara&quot; (Halaman Utama)
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Ubah 2 gambar yang tampil pada section Tentang Prabaswara di halaman utama di bawah hero.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gambar Kiri (Kamera/Kamera Lens) */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <span className="text-xs font-bold text-[#C9A961] uppercase tracking-wider block">
                    1. Gambar Kiri (Kamera Studio)
                  </span>

                  {settings.camera_image_url && (
                    <div className="relative aspect-[3/4] max-h-[220px] rounded-xl overflow-hidden border border-neutral-800 mx-auto">
                      <img
                        src={settings.camera_image_url}
                        alt="Camera preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <label className="cursor-pointer px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all">
                    <Crop className="w-4 h-4 text-[#C9A961]" />
                    <span>Pilih & Crop Gambar Kiri</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSelectFile(e, "settingCamera")}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gambar Kanan (Fotografer Landscape) */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <span className="text-xs font-bold text-[#C9A961] uppercase tracking-wider block">
                    2. Gambar Kanan (Fine Art Landscape)
                  </span>

                  {settings.about_image_url && (
                    <div className="relative aspect-[3/4] max-h-[220px] rounded-xl overflow-hidden border border-neutral-800 mx-auto">
                      <img
                        src={settings.about_image_url}
                        alt="About preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <label className="cursor-pointer px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all">
                    <Crop className="w-4 h-4 text-[#C9A961]" />
                    <span>Pilih & Crop Gambar Kanan</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSelectFile(e, "settingAbout")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Section B: Nomor WA & Email */}
            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 space-y-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-white">
                  Pengaturan Kontak & WhatsApp Utama
                </h2>
                <p className="text-xs text-neutral-400 font-light">
                  Perbarui nomor WhatsApp utama dan email resmi studio Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Nomor WhatsApp Utama
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    placeholder="Format: 6281234567890"
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#C9A961]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="hello@prabaswara.com"
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#C9A961]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Seluruh Pengaturan Website</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* SINGLE UNIFIED MODAL FOR PHOTO / CROP / BRAND COVER / PACKAGE */}
      {(showPhotoModal || showBrandModal || showPackageModal) && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 shrink-0 flex items-center justify-between bg-neutral-900">
              <div>
                <h3 className="font-serif-heading text-xl font-bold text-white">
                  {modalMode === "crop"
                    ? "Editor Potong Gambar (Crop)"
                    : showPackageModal
                    ? editingPackage
                      ? "Edit Paket Harga"
                      : "Tambah Paket Harga Baru"
                    : showBrandModal
                    ? `Ganti Cover Banner ${brandForm.title}`
                    : editingPhoto
                    ? "Edit Foto & Caption Karya"
                    : "Upload Foto Karya Baru"}
                </h3>
                <p className="text-xs text-neutral-400 font-light">
                  {modalMode === "crop"
                    ? "Sesuaikan proporsi foto lalu klik Terapkan Crop."
                    : showPackageModal
                    ? "Isi detail nama paket, harga, benefit, dan kategori sub-brand."
                    : "Pilih file gambar baru untuk dipotong (crop) dan diunggah."}
                </p>
              </div>

              <button
                onClick={() => {
                  if (modalMode === "crop") {
                    setModalMode("form");
                  } else {
                    setShowPhotoModal(false);
                    setShowBrandModal(false);
                    setShowPackageModal(false);
                  }
                }}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* MODE 1: CROPPER MODAL VIEW */}
              {modalMode === "crop" && cropperSrc && (
                <ImageCropperModal
                  imageSrc={cropperSrc}
                  initialAspectRatio={cropRatio}
                  lockAspectRatio={cropperTarget === "brand"}
                  onCropComplete={handleCropComplete}
                  onCancel={() => {
                    setCropperSrc(null);
                    if (cropperTarget === "settingCamera" || cropperTarget === "settingAbout") {
                      setShowPhotoModal(false);
                    } else {
                      setModalMode("form");
                    }
                  }}
                />
              )}
            </div>

            {/* MODE 2A: BRAND COVER EDIT FORM */}
            {modalMode === "form" && showBrandModal && (
              <form onSubmit={handleSaveBrand} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                      Ganti File Gambar Cover Banner *
                    </label>

                    <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-700 hover:border-[#C9A961] rounded-2xl bg-neutral-950 transition-all text-center group">
                      <Crop className="w-6 h-6 text-[#C9A961] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white">
                        Pilih File Cover Banner Baru (Buka Editor Crop)
                      </span>
                      <span className="text-[10px] text-neutral-400 mt-1">
                        Pilih file gambar untuk memotong rasio banner secara interaktif
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={(e) => handleSelectFile(e, "brand")}
                        className="hidden"
                      />
                    </label>

                    {brandForm.coverImage && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Pratinjau Banner Baru Siap Disimpan:</span>
                        </span>
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border-2 border-[#C9A961]/60 bg-neutral-950 shadow-lg flex items-center justify-center">
                          <img
                            key={brandForm.coverImage}
                            src={brandForm.coverImage}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-neutral-800 shrink-0 bg-neutral-950/90 flex items-center justify-end gap-3 z-10">
                  <button
                    type="button"
                    onClick={() => setShowBrandModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Banner Sub-Brand</span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2B: PHOTO EDIT FORM */}
            {modalMode === "form" && showPhotoModal && (
              <form onSubmit={handleSavePhoto} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                  {/* File Selector Button */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                      Ganti / Upload File Gambar Foto *
                    </label>

                    <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-700 hover:border-[#C9A961] rounded-2xl bg-neutral-950 transition-all text-center group">
                      <Crop className="w-6 h-6 text-[#C9A961] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white">
                        Pilih File Gambar Baru (Buka Editor Crop)
                      </span>
                      <span className="text-[10px] text-neutral-400 mt-1">
                        Klik untuk memilih gambar baru dan memotong rasio secara interaktif
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={(e) => handleSelectFile(e, "photo")}
                        className="hidden"
                      />
                    </label>

                    {/* Image Preview Window */}
                    {photoForm.imageUrl && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Pratinjau Gambar Siap Disimpan:</span>
                        </span>
                        <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#C9A961]/60 bg-neutral-950 shadow-lg flex items-center justify-center">
                          <img
                            key={photoForm.imageUrl}
                            src={photoForm.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title & Caption */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                        Judul Foto / Nama Karya *
                      </label>
                      <input
                        type="text"
                        value={photoForm.title}
                        onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                        placeholder="Misal: Sunset Bride / Matrimony at Plataran"
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#C9A961]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                        Caption / Keterangan Gambar
                      </label>
                      <textarea
                        rows={3}
                        value={photoForm.caption}
                        onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                        placeholder="Tuliskan cerita atau keterangan singkat foto ini..."
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                      />
                    </div>
                  </div>

                  {/* Sub-Brand Selection */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                      Pilih Lokasi Sub-Brand Website *
                    </label>
                    <select
                      value={photoForm.brandSlug}
                      onChange={(e) => {
                        const selected = categoryOptions.find((c) => c.slug === e.target.value);
                        setPhotoForm({
                          ...photoForm,
                          brandSlug: e.target.value,
                          brandTitle: selected?.title.split(" (")[0] || "Swara Gallery",
                        });
                      }}
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Checkbox */}
                  <div className="pt-2 flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={photoForm.isFeatured}
                      onChange={(e) => setPhotoForm({ ...photoForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-700 accent-[#C9A961] cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="text-xs text-neutral-300 cursor-pointer font-medium">
                      Tampilkan foto ini di <span className="text-[#C9A961] font-bold">Halaman Utama (Homepage Featured)</span>
                    </label>
                  </div>
                </div>

                {/* Form Actions Footer */}
                <div className="p-4 border-t border-neutral-800 shrink-0 bg-neutral-950/90 flex items-center justify-end gap-3 z-10">
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingPhoto ? "Simpan Perubahan" : "Upload & Simpan"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2C: PACKAGE EDIT FORM */}
            {modalMode === "form" && showPackageModal && (
              <form onSubmit={handleSavePackage} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                  {/* Category & Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                        Kategori Sub-Brand *
                      </label>
                      <select
                        value={packageForm.brand_slug}
                        onChange={(e) => setPackageForm({ ...packageForm, brand_slug: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                      >
                        {categoryOptions.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                        Urutan Tampil
                      </label>
                      <input
                        type="number"
                        value={packageForm.display_order}
                        onChange={(e) =>
                          setPackageForm({ ...packageForm, display_order: Number(e.target.value) })
                        }
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                      Nama Paket Pricelist *
                    </label>
                    <input
                      type="text"
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                      placeholder="Misal: Paket Personal & Studio / Grand Masterpiece Wedding"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#C9A961]"
                      required
                    />
                  </div>

                  {/* Price & Period */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                        Harga Paket *
                      </label>
                      <input
                        type="text"
                        value={packageForm.price}
                        onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                        placeholder="Misal: Rp 750.000 / Rp 4.500.000"
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#C9A961]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                        Keterangan Periode/Sesi
                      </label>
                      <input
                        type="text"
                        value={packageForm.period}
                        onChange={(e) => setPackageForm({ ...packageForm, period: e.target.value })}
                        placeholder="Misal: / sesi photo / hari pernikahan"
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                      Deskripsi Ringkas Paket
                    </label>
                    <textarea
                      rows={2}
                      value={packageForm.description}
                      onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                      placeholder="Penjelasan singkat mengenai paket harga ini..."
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                    />
                  </div>

                  {/* Dynamic Features / Benefits List */}
                  <div className="space-y-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#C9A961] block">
                      Fasilitas & Benefit Paket (List Point):
                    </label>

                    {packageForm.features.length > 0 && (
                      <ul className="space-y-2">
                        {packageForm.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
                          >
                            <span className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-[#C9A961]" />
                              <span>{feat}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = packageForm.features.filter((_, i) => i !== idx);
                                setPackageForm({ ...packageForm, features: updated });
                              }}
                              className="p-1 rounded-lg text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Hapus Benefit Ini"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Add new feature input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newFeatureText.trim()) {
                              setPackageForm({
                                ...packageForm,
                                features: [...packageForm.features, newFeatureText.trim()],
                              });
                              setNewFeatureText("");
                            }
                          }
                        }}
                        placeholder="Ketik poin benefit (misal: 10 Foto Retouched HD) lalu klik +"
                        className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFeatureText.trim()) {
                            setPackageForm({
                              ...packageForm,
                              features: [...packageForm.features, newFeatureText.trim()],
                            });
                            setNewFeatureText("");
                          }
                        }}
                        className="px-4 py-2.5 bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>

                  {/* Is Popular & Label */}
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isPopularPkg"
                        checked={packageForm.is_popular}
                        onChange={(e) =>
                          setPackageForm({ ...packageForm, is_popular: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-neutral-700 accent-[#C9A961] cursor-pointer"
                      />
                      <label
                        htmlFor="isPopularPkg"
                        className="text-xs text-neutral-200 cursor-pointer font-semibold"
                      >
                        Tandai Sebagai <span className="text-[#C9A961]">Paket Populer / Rekomendasi</span>
                      </label>
                    </div>

                    {packageForm.is_popular && (
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                          Label Badge Populer
                        </label>
                        <input
                          type="text"
                          value={packageForm.popular_label}
                          onChange={(e) =>
                            setPackageForm({ ...packageForm, popular_label: e.target.value })
                          }
                          placeholder="PALING POPULER / REKOMENDASI BISNIS"
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Custom WA Message */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1">
                      Pesan WhatsApp Otomatis (Saat Tombol Diklik)
                    </label>
                    <textarea
                      rows={2}
                      value={packageForm.wa_message}
                      onChange={(e) =>
                        setPackageForm({ ...packageForm, wa_message: e.target.value })
                      }
                      placeholder="Halo Prabaswara, saya tertarik dengan paket ini..."
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A961]"
                    />
                  </div>
                </div>

                {/* Form Actions Footer */}
                <div className="p-4 border-t border-neutral-800 shrink-0 bg-neutral-950/90 flex items-center justify-end gap-3 z-10">
                  <button
                    type="button"
                    onClick={() => setShowPackageModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingPackage ? "Simpan Perubahan Paket" : "Simpan Paket Baru"}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
