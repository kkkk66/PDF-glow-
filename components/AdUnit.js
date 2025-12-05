import React from 'react'

const AdUnit = ({ adSlot }) => {
  return (
    <div style={{ margin: '16px 0', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXX"
        data-ad-slot={adSlot || '1234567890'}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
    </div>
  )
}

export default AdUnit