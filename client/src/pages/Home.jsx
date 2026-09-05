import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Store, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.products || data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load products."
        );
      }
    };

    load();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              The modern multi-vendor marketplace
            </span>

            <h1>
              Discover. <span>Shop.</span> Belong.
            </h1>

            <p>
              ShopSphere connects independent sellers with
              modern shoppers through a fast, secure and
              beautifully designed marketplace.
            </p>

            <div className="hero-actions">
              <Link className="button" to="/products">
                Explore marketplace
                <ArrowRight size={17} />
              </Link>

              <Link
                className="button secondary"
                to="/auth?mode=register"
              >
                Become a seller
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <span className="eyebrow">
              Built for trust
            </span>

            <h2>
              One marketplace.
              <br />
              Three powerful roles.
            </h2>

            <p>
              Buyers shop, sellers grow and administrators
              operate the platform from one connected system.
            </p>

            <div className="hero-stat">
              <strong>3</strong>
              <span>controlled account roles</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card">
              <ShieldCheck />
              <h3>Secure checkout</h3>
              <p>
                Stripe-powered payment confirmation with
                signed webhooks.
              </p>
            </div>

            <div className="feature-card">
              <Store />
              <h3>Independent sellers</h3>
              <p>
                Seller-owned catalogs and fulfillment
                workflows.
              </p>
            </div>

            <div className="feature-card">
              <Zap />
              <h3>Fast experience</h3>
              <p>
                React, Vite and optimized REST APIs for a
                responsive storefront.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                Curated marketplace
              </span>

              <h2>Featured products</h2>
            </div>

            <Link to="/products">
              View all →
            </Link>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>

          {!products.length && !error && (
            <div className="empty">
              No products available yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
}