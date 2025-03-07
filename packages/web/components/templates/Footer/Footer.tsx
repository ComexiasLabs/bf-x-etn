import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <section className={styles.footer}>
      <Container>
        <Row>
          <Col lg={4} md={4}>
            <div className={styles.brand}>
              <img src="/assets/blockfabric/bf-logo-dark.svg" alt="BlockFabric" />
            </div>
            <p className={styles.appDescription}>
              Block Fabric is a blockchain dapp manager that lets you create, manage and view analytics for all your
              smart contracts on the blockchain.
            </p>
            <div className={styles.label}>Connect with us</div>
            <div className={styles.iconWrapper}>
              <div className={styles.iconContainer}>
                <div className={styles.invertColor}>
                  <a href="mailto:blockfabric@comexiaslabs.com">
                    <img src="/assets/icons/email.svg" alt="Email" />
                  </a>
                </div>
              </div>
              <div className={styles.iconContainer}>
                <div className={styles.invertColor}>
                  <a href="https://x.com/ComexiasLabs" target="_blank">
                    <img src="/assets/brands/x-icon.svg" alt="X.com" style={{ height: 20 }} />
                  </a>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={8} md={8}>
            <Container style={{ paddingTop: 12 }}>
              <Row>
                <Col lg={4} md={4}>
                  <b>Block Fabric</b>
                  <ul className={styles.list}>
                    <li>
                      <a className={styles.link} href="/#learn-more">
                        About
                      </a>
                    </li>
                    <li>
                      <a className={styles.link} href="/#templates">
                        Features
                      </a>
                    </li>
                    <li>
                      <a className={styles.link} href="/#pricing">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a className={styles.link} href="/#beta">
                        Beta Preview
                      </a>
                    </li>
                  </ul>
                </Col>
                <Col lg={4} md={4}>
                  <b>Documentation</b>
                  <ul className={styles.list}>
                    <li>
                      <a className={styles.link} href="https://docs.blockfabric.dev">
                        BlockFabric Docs
                      </a>
                    </li>
                    <li>
                      <a className={styles.link} href="https://docs.blockfabric.dev/getting-started/connecting-wallet">
                        Getting Started
                      </a>
                    </li>
                    <li>
                      <a
                        className={styles.link}
                        href="https://docs.blockfabric.dev/applications/creating-a-new-contract"
                      >
                        Managing Smart Contracts
                      </a>
                    </li>
                    <li>
                      <a
                        className={styles.link}
                        href="https://docs.blockfabric.dev/analytics-dashboard/analytics-overview"
                      >
                        Analytics Overview
                      </a>
                    </li>
                  </ul>
                </Col>
                <Col lg={4} md={4}>
                  <b>Contribution</b>
                  <ul className={styles.list}>
                    <li>
                      <a className={styles.link} href="https://github.com/ComexiasLab/blockfabric-templates">
                        Templates Github
                      </a>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Footer;
