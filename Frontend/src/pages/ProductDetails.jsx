import Rating from "@mui/material/Rating";
import { FaMinus, FaPlus, FaHeart, FaShare, FaCheck, FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaTag, FaDownload, FaTimes, FaCopy, FaWhatsapp, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { userRequest } from "../requestMethod";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProduct } from '../redux/cartRedux';
import { showAverageRating } from "../components/Ratings"
import { trackPageView, trackButtonClick, trackUserAction } from '../utils/analytics';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2]
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [downloadingManual, setDownloadingManual] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart)
  const user = useSelector((state) => state.user);
  const autoSlideRef = useRef(null);

  let price;

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (product.originalPrice && product.discountedPrice) {
      const discount = ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercentage = calculateDiscountPercentage();

  // Format description with rich text for PDF
  const formatDescriptionForPDF = (text) => {
    if (!text) return '';
    
    // Remove markdown formatting for PDF
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\*(.*?)\*/g, '$1');
    
    return text;
  };

  // Format description with rich text for HTML display
  const formatDescription = (text) => {
    if (!text) return '';
    
    // Replace **bold** with <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *italic* with <em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace bullet points and new lines
    const lines = text.split('\n');
    const formattedLines = lines.map(line => {
      if (line.trim().startsWith('•')) {
        return `<li class="flex items-start mb-2"><span class="text-pink-500 mr-3 mt-1">•</span><span>${line.replace('•', '').trim()}</span></li>`;
      } else if (line.trim().match(/^\d+\./)) {
        return `<li class="flex items-start mb-2"><span class="text-pink-500 mr-3 mt-1">${line.split('.')[0]}.</span><span>${line.substring(line.indexOf('.') + 1).trim()}</span></li>`;
      } else if (line.trim() === '') {
        return '<br/>';
      } else {
        return `<p class="mb-3">${line}</p>`;
      }
    });
    
    // Check if we have any list items
    const hasListItems = formattedLines.some(line => line.includes('<li'));
    
    if (hasListItems) {
      return `<div class="space-y-3">${formattedLines.join('')}</div>`;
    }
    
    return formattedLines.join('');
  };

  // Load image and convert to base64 for PDF
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Share functionality
  const handleShare = () => {
    setShowSharePopup(true);
    
    // Analytics: Track share popup open
    trackButtonClick('product_share_popup_open', {
      product_id: product._id,
      product_name: product.title
    });
  };

  const closeSharePopup = () => {
    setShowSharePopup(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard!");
    
    // Analytics: Track copy link
    trackButtonClick('product_share_copy_link', {
      product_id: product._id,
      product_name: product.title
    });
  };

  const shareOnSocialMedia = (platform) => {
    const shareUrl = window.location.href;
    const title = `Check out ${product.title} from KILIFONIA BEAUTY`;
    const text = product.desc ? product.desc.substring(0, 100) + '...' : 'Amazing beauty product from KILIFONIA BEAUTY!';
    
    let shareLink = '';
    
    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't have direct sharing, so we copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast.success("Product link copied! You can now share it on Instagram.");
        // Analytics: Track Instagram share attempt
        trackButtonClick('product_share_instagram', {
          product_id: product._id,
          product_name: product.title
        });
        return;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
    
    // Analytics: Track social media share
    trackButtonClick('product_share_social', {
      product_id: product._id,
      product_name: product.title,
      platform: platform
    });
  };

  // Download Manual Function
  const downloadManual = async () => {
    if (!product.desc) {
      toast.error("No product description available for manual");
      return;
    }

    setDownloadingManual(true);
    
    // Analytics: Track manual download
    trackButtonClick('product_manual_download', {
      product_id: product._id,
      product_name: product.title,
      user_logged_in: !!user.currentUser
    });

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Dubois Beauty colors - Black and Gold theme
      const blackColor = [0, 0, 0]; // Black
      const goldColor = [212, 175, 55]; // Gold
      const lightGold = [245, 230, 180]; // Light Gold for backgrounds
      const pinkColor = [219, 39, 119]; // Pink for QR code
      
      // Load logo image
      const logoUrl = "https://res.cloudinary.com/dkdx7xytz/image/upload/v1772469610/blisslogo1_rwlktl.png"
      
      try {
        // Add header with black background
        pdf.setFillColor(...blackColor);
        pdf.rect(0, 0, pageWidth, 50, 'F');
        
        // Add logo to PDF
        const logoDataUrl = await loadImageAsBase64(logoUrl);
        pdf.addImage(logoDataUrl, 'PNG', 20, 10, 30, 30);
        
        // KILIFONIA BEAUTY text in gold
        pdf.setTextColor(...goldColor);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KILIFONIA BEAUTY', 60, 25);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Premium Skincare Solutions', 60, 32);
        
      } catch (logoError) {
        console.log('Logo loading failed, using fallback:', logoError);
        // Fallback: Simple text logo
        pdf.setFillColor(...blackColor);
        pdf.rect(0, 0, pageWidth, 40, 'F');
        pdf.setTextColor(...goldColor);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KILIFONIA BEAUTY', pageWidth / 2, 25, { align: 'center' });
      }
      
      let yPosition = 60;
      
      // Product title in black
      pdf.setTextColor(...blackColor);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize(product.title.toUpperCase(), pageWidth - 40);
      titleLines.forEach((line, index) => {
        pdf.text(line, pageWidth / 2, yPosition + (index * 7), { align: 'center' });
      });
      yPosition += (titleLines.length * 7) + 5;
      
      // Serial Number in gold
      pdf.setTextColor(...goldColor);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Serial Number: ${product._id}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      
      // Add product image if available
      if (product.img && product.img.length > 0) {
        try {
          const productImageDataUrl = await loadImageAsBase64(product.img[0]);
          pdf.addImage(productImageDataUrl, 'JPEG', pageWidth / 2 - 40, yPosition, 80, 80);
          yPosition += 90;
        } catch (imageError) {
          console.log('Product image loading failed:', imageError);
        }
      }
      
      // Usage Instructions header with gold background
      pdf.setFillColor(...goldColor);
      pdf.rect(20, yPosition, pageWidth - 40, 12, 'F');
      pdf.setTextColor(...blackColor);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PRODUCT USAGE MANUAL', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      yPosition += 20;
      
      // Product description in black
      pdf.setTextColor(...blackColor);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const description = formatDescriptionForPDF(product.desc);
      const splitText = pdf.splitTextToSize(description, pageWidth - 40);
      
      splitText.forEach((line, index) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 30;
          // Add gold border to new page
          pdf.setDrawColor(...goldColor);
          pdf.setLineWidth(0.5);
          pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
        }
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;
      
      // Key Features section with light gold background
      if ((product.concern && product.concern.length > 0) || (product.skintype && product.skintype.length > 0)) {
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = 30;
          // Add gold border to new page
          pdf.setDrawColor(...goldColor);
          pdf.setLineWidth(0.5);
          pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
        }
        
        pdf.setFillColor(...lightGold);
        pdf.rect(20, yPosition, pageWidth - 40, 12, 'F');
        pdf.setTextColor(...blackColor);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KEY FEATURES & BENEFITS', pageWidth / 2, yPosition + 8, { align: 'center' });
        
        yPosition += 20;
        pdf.setTextColor(...blackColor);
        pdf.setFontSize(9);
        
        // Skin Concerns
        if (product.concern && product.concern.length > 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.text('Targeted Skin Concerns:', 20, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');
          product.concern.forEach((concern, index) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = 30;
              // Add gold border to new page
              pdf.setDrawColor(...goldColor);
              pdf.setLineWidth(0.5);
              pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
            }
            pdf.text(`• ${concern}`, 25, yPosition);
            yPosition += 5;
          });
          yPosition += 5;
        }
        
        // Skin Types
        if (product.skintype && product.skintype.length > 0) {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 30;
            // Add gold border to new page
            pdf.setDrawColor(...goldColor);
            pdf.setLineWidth(0.5);
            pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
          }
          pdf.setFont('helvetica', 'bold');
          pdf.text('Recommended Skin Types:', 20, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');
          product.skintype.forEach((type, index) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = 30;
              // Add gold border to new page
              pdf.setDrawColor(...goldColor);
              pdf.setLineWidth(0.5);
              pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
            }
            pdf.text(`• ${type}`, 25, yPosition);
            yPosition += 5;
          });
        }
      }
      
      // Generate QR Code in Pink
      try {
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = 30;
          // Add gold border to new page
          pdf.setDrawColor(...goldColor);
          pdf.setLineWidth(0.5);
          pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
        }
        
        const productUrl = `https://www. kilifoniabeautybliss.co.ke/product/${product._id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
          width: 80,
          margin: 1,
          color: {
            dark: `#db2777`, // Pink color
            light: '#FFFFFF'
          }
        });
        
        // QR Code section with gold background
        pdf.setFillColor(...goldColor);
        pdf.rect(20, yPosition, pageWidth - 40, 15, 'F');
        pdf.setTextColor(...blackColor);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SCAN FOR MORE INFORMATION', pageWidth / 2, yPosition + 10, { align: 'center' });
        
        yPosition += 25;
        
        // Add Pink QR Code
        pdf.addImage(qrCodeDataUrl, 'PNG', pageWidth / 2 - 25, yPosition, 50, 50);
        
        yPosition += 60;
        
        // QR Code description
        pdf.setTextColor(...blackColor);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Scan this QR code to view this product online', pageWidth / 2, yPosition, { align: 'center' });
        pdf.text('or visit:', pageWidth / 2, yPosition + 5, { align: 'center' });
        pdf.setTextColor(...goldColor);
        pdf.setFont('helvetica', 'bold');
        pdf.text(` kilifoniabeautybliss.co.ke/product/${product._id}`, pageWidth / 2, yPosition + 12, { align: 'center' });
        
      } catch (qrError) {
        console.log('QR Code generation failed:', qrError);
      }
      
      // Add gold border to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        
        // Add gold border
        pdf.setDrawColor(...goldColor);
        pdf.setLineWidth(0.5);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
        
        // Dubois Beauty watermark in light gold
        pdf.setTextColor(...lightGold);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text(' KILIFONIA BEAUTY', pageWidth / 2, pageHeight / 2, { 
          align: 'center',
          angle: 45 
        });
        
        // Serial number watermark
        pdf.setTextColor(220, 220, 220);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`SN: ${product._id}`, pageWidth - 25, pageHeight - 15, { angle: 45 });
      }
      
      // Footer on last page
      pdf.setPage(pageCount);
      pdf.setTextColor(...blackColor);
      pdf.setFontSize(8);
      pdf.text(`Generated on ${new Date().toLocaleDateString()} • KILIFONIA BEAUTY - Premium Skincare Solutions`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Save the PDF
      pdf.save(`${product.title.replace(/[^a-zA-Z0-9]/g, '_')}_Manual.pdf`);
      
      toast.success("Product manual downloaded successfully!");
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to download manual. Please try again.");
    } finally {
      setDownloadingManual(false);
    }
  };

  // Analytics: Track page view
  useEffect(() => {
    trackPageView('product_detail_page');
  }, []);

  // Analytics: Track product view
  useEffect(() => {
    if (product._id) {
      trackButtonClick('product_view', {
        product_id: product._id,
        product_name: product.title,
        product_category: product.categories?.[0],
        product_price: product.discountedPrice || product.originalPrice,
        has_discount: !!product.discountedPrice,
        discount_percentage: discountPercentage,
        user_logged_in: !!user.currentUser
      });
    }
  }, [product, user.currentUser, discountPercentage]);

  const handleQuantity = (action) => {
    const oldQuantity = quantity;
    let newQuantity;
    
    if (action === "dec") {
      newQuantity = quantity === 1 ? 1 : quantity - 1;
    } else if (action === "inc") {
      newQuantity = quantity + 1;
    }
    
    setQuantity(newQuantity);
    
    // Analytics: Track quantity change
    trackButtonClick('product_quantity_change', {
      product_id: product._id,
      product_name: product.title,
      old_quantity: oldQuantity,
      new_quantity: newQuantity,
      change_type: action === 'inc' ? 'increase' : 'decrease'
    });
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await userRequest.get("/products/find/" + id);
        setProduct(res.data);
        
        // Analytics: Track product loaded successfully
        trackButtonClick('product_loaded', {
          product_id: res.data._id,
          product_name: res.data.title,
          images_count: res.data.img?.length || 0,
          has_discount: !!res.data.discountedPrice,
          discount_percentage: calculateDiscountPercentage()
        });
        
        // Set the first image as selected by default
        if (res.data.img && res.data.img.length > 0) {
          setSelectedImage(0);
        }
      } catch (error) {
        console.log(error);
        
        // Analytics: Track product load error
        trackButtonClick('product_load_error', {
          product_id: id,
          error: error.message
        });
      }
    };

    getProduct();
  }, [id]);

  // Improved auto slide functionality
  useEffect(() => {
    if (!autoSlide || !product.img || product.img.length <= 1 || isHovering) return;

    // Clear any existing interval
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }

    // Set new interval with slower slide (6 seconds)
    autoSlideRef.current = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.img.length);
    }, 6000); // Change image every 6 seconds

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [autoSlide, product.img, isHovering]);

  const nextImage = () => {
    if (product.img && product.img.length > 0) {
      const oldIndex = selectedImage;
      setSelectedImage((prev) => (prev + 1) % product.img.length);
      setAutoSlide(false); // Stop auto-slide when manually navigating
      
      // Analytics: Track image navigation
      trackButtonClick('product_image_navigation', {
        product_id: product._id,
        product_name: product.title,
        from_image: oldIndex,
        to_image: (oldIndex + 1) % product.img.length,
        navigation_type: 'next',
        total_images: product.img.length
      });
    }
  };

  const prevImage = () => {
    if (product.img && product.img.length > 0) {
      const oldIndex = selectedImage;
      setSelectedImage((prev) => (prev - 1 + product.img.length) % product.img.length);
      setAutoSlide(false); // Stop auto-slide when manually navigating
      
      // Analytics: Track image navigation
      trackButtonClick('product_image_navigation', {
        product_id: product._id,
        product_name: product.title,
        from_image: oldIndex,
        to_image: (oldIndex - 1 + product.img.length) % product.img.length,
        navigation_type: 'previous',
        total_images: product.img.length
      });
    }
  };

  const handleImageSelect = (index) => {
    const oldIndex = selectedImage;
    setSelectedImage(index);
    setAutoSlide(false); // Stop auto-slide when manually selecting an image
    
    // Analytics: Track image selection
    trackButtonClick('product_image_select', {
      product_id: product._id,
      product_name: product.title,
      from_image: oldIndex,
      to_image: index,
      total_images: product.img.length
    });
  };

  const toggleAutoSlide = () => {
    const newAutoSlideState = !autoSlide;
    setAutoSlide(newAutoSlideState);
    
    // Analytics: Track auto-slide toggle
    trackButtonClick('product_auto_slide_toggle', {
      product_id: product._id,
      product_name: product.title,
      new_state: newAutoSlideState ? 'enabled' : 'disabled',
      total_images: product.img?.length || 0
    });
    
    if (!newAutoSlideState) {
      // If we're turning auto-slide back on, also clear any hover state
      setIsHovering(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Auto-slide will restart automatically due to useEffect dependency
  };

  const handlePrice = (
    originalPrice,
    discountedPrice,
    wholePrice,
    minimumQuantity,
    quantity
  ) => {
    if (quantity > minimumQuantity && discountedPrice) {
      discountedPrice = wholePrice;
      price = discountedPrice;
      return price;
    } else if (quantity > minimumQuantity && originalPrice) {
      originalPrice = wholePrice;
      price = originalPrice;
      return price;
    } else if (discountedPrice) {
      price = discountedPrice;
      return price;
    } else {
      price = originalPrice;
      return price;
    }
  };

  const handleAddToCart = () => {
    // Analytics: Track add to cart
    trackButtonClick('product_add_to_cart', {
      product_id: product._id,
      product_name: product.title,
      product_price: price,
      quantity: quantity,
      total_price: price * quantity,
      has_discount: !!product.discountedPrice,
      discount_percentage: discountPercentage,
      user_logged_in: !!user.currentUser
    });

    dispatch(addProduct({ ...product, quantity, price, email: 'johndoe@gmail.com' }))
    toast.success("Product added to cart successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const toggleWishlist = () => {
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    
    // Analytics: Track wishlist toggle
    trackButtonClick('product_wishlist_toggle', {
      product_id: product._id,
      product_name: product.title,
      new_state: newWishlistState ? 'added' : 'removed',
      user_logged_in: !!user.currentUser
    });
    
    toast.success(newWishlistState ? "Added to wishlist" : "Removed from wishlist");
  }

  const handleFeatureClick = (featureType, value) => {
    // Analytics: Track feature clicks
    trackButtonClick('product_feature_click', {
      product_id: product._id,
      product_name: product.title,
      feature_type: featureType,
      feature_value: value
    });
  }

  const handleReviewInteraction = (action, reviewIndex, reviewData) => {
    // Analytics: Track review interactions
    trackButtonClick('product_review_interaction', {
      product_id: product._id,
      product_name: product.title,
      action: action,
      review_index: reviewIndex,
      reviewer: reviewData?.postedBy,
      rating: reviewData?.star
    });
  }

  // Use actual product images array
  const productImages = product.img || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* Share Popup */}
        {showSharePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Share this product</h3>
                <button 
                  onClick={closeSharePopup}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Product link:</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={window.location.href}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaCopy className="text-sm" />
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-3">Share on social media:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => shareOnSocialMedia('whatsapp')}
                    className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="text-lg" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => shareOnSocialMedia('facebook')}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaFacebookF className="text-lg" />
                    Facebook
                  </button>
                  <button 
                    onClick={() => shareOnSocialMedia('instagram')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaInstagram className="text-lg" />
                    Instagram
                  </button>
                  <button 
                    onClick={() => shareOnSocialMedia('linkedin')}
                    className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaLinkedinIn className="text-lg" />
                    LinkedIn
                  </button>
                </div>
              </div>
              
              <button 
                onClick={closeSharePopup}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product Images */}
          <div className="flex-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-6 left-6 z-10 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <FaTag className="text-sm" />
                    <span className="font-bold text-sm">{discountPercentage}% OFF</span>
                  </div>
                )}

                {/* Main Image with Navigation */}
                <div 
                  className="relative h-96 mb-4 rounded-xl overflow-hidden group"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {productImages.length > 0 ? (
                    <>
                      <img
                        src={productImages[selectedImage]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                      />
                      
                      {/* Navigation Arrows */}
                      {productImages.length > 1 && (
                        <>
                          <button 
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-opacity-70 hover:scale-110"
                          >
                            <FaChevronLeft className="text-lg" />
                          </button>
                          <button 
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-opacity-70 hover:scale-110"
                          >
                            <FaChevronRight className="text-lg" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      {productImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {selectedImage + 1} / {productImages.length}
                        </div>
                      )}
                      
                      {/* Auto Slide Toggle */}
                      {productImages.length > 1 && (
                        <button 
                          onClick={toggleAutoSlide}
                          className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full text-sm hover:bg-opacity-70 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                        >
                          {autoSlide ? <FaPause className="text-xs" /> : <FaPlay className="text-xs" />}
                          {autoSlide ? 'Pause' : 'Play'}
                        </button>
                      )}

                      {/* Auto-slide Status Indicator */}
                      {productImages.length > 1 && autoSlide && !isHovering && (
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                          Auto-sliding...
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:bg-pink-50 transition-all duration-300 hover:scale-110"
                  >
                    <FaHeart className={isWishlisted ? "text-pink-600" : "text-gray-400"} />
                  </button>
                </div>
                
                {/* Thumbnail Gallery */}
                {productImages.length > 1 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Product Images ({productImages.length})</h4>
                      <span className="text-xs text-gray-500">
                        {autoSlide ? 'Auto-slide: ON' : 'Auto-slide: OFF'}
                      </span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {productImages.map((img, index) => (
                        <div 
                          key={index} 
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                            selectedImage === index ? 'border-pink-400 shadow-md scale-105' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleImageSelect(index)}
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          <img 
                            src={img} 
                            alt={`${product.title} ${index + 1}`} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                          {selectedImage === index && (
                            <div className="absolute inset-0 bg-pink-400 bg-opacity-20 border-2 border-pink-400 rounded-lg"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Navigation Dots */}
                {productImages.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          selectedImage === index 
                            ? 'bg-pink-600 w-8' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Features */}
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.concern && product.concern.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Skin Concerns</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.concern.map((concern, index) => (
                          <span 
                            key={index} 
                            className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-pink-200 transition-colors"
                            onClick={() => handleFeatureClick('skin_concern', concern)}
                          >
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {product.skintype && product.skintype.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Skin Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.skintype.map((type, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                            onClick={() => handleFeatureClick('skin_type', type)}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {product.categories && product.categories.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.categories.map((category, index) => (
                          <span 
                            key={index} 
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200 transition-colors"
                            onClick={() => handleFeatureClick('category', category)}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="mr-4">
                 {showAverageRating(product)}
                </div>
                <span className="text-gray-500 text-sm">
                  ({product.ratings?.length || 0} reviews)
                </span>
              </div>

              {/* Product Description with formatted content */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
                <div 
                  className="text-gray-600 leading-relaxed prose prose-pink max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatDescription(product.desc) }}
                />
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-pink-700 mr-3">
                    Ksh
                    {handlePrice(
                      product.originalPrice,
                      product.discountedPrice,
                      product.wholesalePrice,
                      product?.wholesaleMinimumQuantity,
                      quantity
                    )}
                  </span>
                  {product.discountedPrice && product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      Ksh{product.originalPrice}
                    </span>
                  )}
                </div>
                
                {product.discountedPrice && (
                  <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                    Save Ksh{(product.originalPrice - product.discountedPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Wholesale Notice */}
              {product.wholesalePrice && (
                <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 mb-8">
                  <div className="flex items-center">
                    <FaCheck className="text-pink-600 mr-2" />
                    <span className="font-medium text-pink-700">
                      Wholesale Available: Ksh{product.wholesalePrice} for {product.wholesaleMinimumQuantity}+ items
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantity("dec")}
                    className="w-12 h-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-l-full hover:bg-pink-200 transition-colors duration-300"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center bg-white border-t border-b border-gray-200 text-lg font-medium">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantity("inc")}
                    className="w-12 h-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-r-full hover:bg-pink-200 transition-colors duration-300"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg mb-4"
              >
                Add to Cart
              </button>

              {/* Additional Actions */}
              <div className="flex gap-4">
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                >
                  <FaShare />
                  Share
                </button>
                <button 
                  onClick={downloadManual}
                  disabled={downloadingManual || !product.desc}
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaDownload />
                  {downloadingManual ? 'Downloading...' : 'Manual'}
                </button>
              </div>

              {/* Product Details */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h3>
                
                <div className="bg-pink-50 rounded-xl p-5 mb-6">
                  <h4 className="font-medium text-pink-800 mb-3 flex items-center">
                    <FaCheck className="mr-2" />
                    What's Included
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{product.title}</li>
                    <li>User manual</li>
                    <li>30-day satisfaction guarantee</li>
                  </ul>
                </div>

                {/* Features/Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "100% Natural Ingredients", icon: "🌿" },
                    { label: "Cruelty Free", icon: "🐰" },
                    { label: "Dermatologist Tested", icon: "🔬" },
                    { label: "Vegan Formula", icon: "🌱" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition-colors"
                      onClick={() => handleFeatureClick('product_feature', feature.label)}
                    >
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-pink-600">{feature.icon}</span>
                      </div>
                      <span className="text-gray-700">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              {product.ratings && product.ratings.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Customer Reviews</h3>
                  
                  <div className="space-y-6">
                    {product.ratings.map((rating, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center mb-3">
                         <Rating 
                         value={Number(rating.star)}
                          readOnly 
                          size="small" />
                        <span className="font-medium text-gray-800 ml-3">
                             {typeof rating?.postedBy === "object"
                             ? rating?.postedBy?.name || "Anonymous"
                            : rating?.postedBy || "Anonymous"}
                          </span>
                        </div>
                       <p className="text-gray-600">
                         {typeof rating?.comment === "string"
                         ? rating.comment
                         : rating?.comment?.text || "No comment provided"}
                       </p>
                        
                        {/* Review Actions */}
                        <div className="mt-3 flex gap-4">
                          <button 
                            onClick={() => handleReviewInteraction('helpful', index, rating)}
                            className="text-sm text-gray-500 hover:text-pink-600 transition-colors"
                          >
                            Helpful ({Math.floor(Math.random() * 10)})
                          </button>
                          <button 
                            onClick={() => handleReviewInteraction('report', index, rating)}
                            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                          >
                            Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;