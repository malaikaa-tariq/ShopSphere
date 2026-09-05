export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>ShopSphere</strong>
          <p>
            A premium multi-vendor marketplace built with MERN.
          </p>
        </div>

        <div className="footer-copy">
          © {new Date().getFullYear()} ShopSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
}