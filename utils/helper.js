const   getDownloadURL=(path)=>{
    const baseUrl =
    "https://lkefjyhyetaykbxencgg.supabase.co/storage/v1/object/public/srishti/";
    return baseUrl + encodeURIComponent(path)
}   

module.exports={
    getDownloadURL}