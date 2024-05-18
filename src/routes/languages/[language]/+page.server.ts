import { getLanguageInfo } from "$lib/server/language";

export function load({ params }: { params: { language: string }}) {
  
  return {
    info: getLanguageInfo(params.language),
  };
}
