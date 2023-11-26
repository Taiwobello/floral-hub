export interface InstagramPost {
  id: string;
  mediaType: "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  permalink: string;
}
