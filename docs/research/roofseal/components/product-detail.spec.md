# Product detail component specification

Target: src/components/sites/roofseal/product/ProductPage.tsx and product.module.css. Route /products/roofseal-deck762. Screenshot ../../design-references/roofseal/product-detail.png. Exact Figma extracts 28318-4413.md and 28318-4405.md supply all source copy and static assets.

Desktop1920: shared90header,37breadcrumbs. Detail section925px; container1240 centered (left340). Gallery611 wide, back control at top30, gap31 then609square border1 rgba183,195,192,.6. Two145square thumbnails centered gap10. Right text580 wide starts left1000 top80, title60/72 weight800 tracking-1.8, sections gap30, thin line borders. Description title24/36 bold then five16/24 bullets. Red diagonal Add to Quote and tertiary Download Catalogue. Category and SKU source copy. Recommendations770 tall background#f5f5f5 with exact50px diagonal top/bottom assets, title40/48 at110top, gap50 to four bordered cards1241wide with30gap, square images,20padding,16px red uppercase category and20/30 bold titles. Footer globally provided.

Interaction: thumbnail selects large image; Add to Quote updates persisted local quote state through useQuote().addQuote; header quote drawer supports removal and mailto request. Catalogue missing actual downloadable file: notify explicitly instead of inventing one. Recommendations not designed as separate detail pages: show explicit local preview feedback. Back source destination is Metal Roofing Division.

Assets: asset('28318:4413','imgProductImage'), imgProductImage1; recommendations asset('28318:4405','imgFeatureCardBackground' plus numbered1,2,3), exact decorative imgSectionBackground and imgSectionBackground1. Downloaded locally with hashed names. Static asset bytes never substituted.

Responsive: max1240 container, collapse two columns below900, 20px mobile margins; retain16px body,36px mobile title. Recommendation four->two->one below480. Default state first image selected. Verify gallery selection, quote persistence/removal, no missing assets, no overflow, typecheck and production build.
