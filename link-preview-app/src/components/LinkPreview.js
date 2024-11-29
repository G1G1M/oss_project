import React from 'react';
import { useQuery } from '@tanstack/react-query';

const LinkPreview = ({ url }) => {
  const fallbackImage = 'https://via.placeholder.com/150';

  // URL 정리 함수: https: 추가
  const formatUrl = (rawUrl) => {
    if (!rawUrl) return null;

    // `http` 또는 `https`가 없는 경우 `https:` 추가
    return rawUrl.startsWith('http') ? rawUrl : `https:${rawUrl}`;
  };

  const formattedUrl = formatUrl(url);

  const {
    data: image,
    isSuccess,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [`image-preview-${formattedUrl}`],
    queryFn: async () => {
      if (!formattedUrl) throw new Error('Invalid URL provided');

      // 프록시 서버를 통해 CORS 우회
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        formattedUrl
      )}`;
      return proxyUrl;
    },
    enabled: !!formattedUrl, // URL이 제공된 경우에만 실행
  });

  return (
    <div>
      {isFetching && <p>Loading preview...</p>}
      {isError && <p>Error: {error.message}</p>}
      {isSuccess && (
        <img
          src={image || fallbackImage}
          alt="Link Preview"
          style={{ maxWidth: '100%' }}
        />
      )}
    </div>
  );
};

export default LinkPreview;
