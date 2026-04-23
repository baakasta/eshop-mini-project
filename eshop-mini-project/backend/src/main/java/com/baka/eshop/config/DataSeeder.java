package com.baka.eshop.config;

import com.baka.eshop.domain.entity.*;
import com.baka.eshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User admin = new User();
        admin.setEmail("admin@eshop.com");
        admin.setMotDePasse(passwordEncoder.encode("admin123"));
        admin.setPrenom("Admin");
        admin.setNom("System");
        admin.setRole(RoleEnum.ADMIN);
        admin.setActif(ActifEnum.ACTIVE);
        admin.setDateCreation(Instant.now());
        userRepository.save(admin);

        SellerProfile adminSp = new SellerProfile();
        adminSp.setUser(admin);
        adminSp.setNomBoutique("E-Shop Officiel");
        adminSp.setDescription("Boutique officielle de la plateforme");
        adminSp.setLogo("https://placehold.co/200x200/1e293b/white?text=ES");
        adminSp.setNote(5.0);
        sellerProfileRepository.save(adminSp);

        User seller = new User();
        seller.setEmail("seller@eshop.com");
        seller.setMotDePasse(passwordEncoder.encode("seller123"));
        seller.setPrenom("Mohamed");
        seller.setNom("Boutique");
        seller.setRole(RoleEnum.SELLER);
        seller.setActif(ActifEnum.ACTIVE);
        seller.setDateCreation(Instant.now());
        userRepository.save(seller);

        SellerProfile sp = new SellerProfile();
        sp.setUser(seller);
        sp.setNomBoutique("TechStore TN");
        sp.setDescription("Meilleure boutique tech en Tunisie");
        sp.setLogo("https://placehold.co/200x200/4F46E5/white?text=TS");
        sp.setNote(4.5);
        sellerProfileRepository.save(sp);

        User customer = new User();
        customer.setEmail("customer@eshop.com");
        customer.setMotDePasse(passwordEncoder.encode("customer123"));
        customer.setPrenom("Ahmed");
        customer.setNom("Client");
        customer.setRole(RoleEnum.CUSTOMER);
        customer.setActif(ActifEnum.ACTIVE);
        customer.setDateCreation(Instant.now());
        userRepository.save(customer);

        Category electronics = new Category();
        electronics.setNom("Électronique");
        electronics.setDescription("Appareils électroniques et gadgets");
        categoryRepository.save(electronics);

        Category phones = new Category();
        phones.setNom("Smartphones");
        phones.setDescription("Téléphones portables");
        phones.setParent(electronics);
        categoryRepository.save(phones);

        Category laptops = new Category();
        laptops.setNom("Ordinateurs Portables");
        laptops.setDescription("Laptops et notebooks");
        laptops.setParent(electronics);
        categoryRepository.save(laptops);

        Category fashion = new Category();
        fashion.setNom("Mode");
        fashion.setDescription("Vêtements et accessoires");
        categoryRepository.save(fashion);

        Category home = new Category();
        home.setNom("Maison");
        home.setDescription("Articles pour la maison");
        categoryRepository.save(home);

        createProduct(sp, "iPhone 15 Pro Max", "Le dernier iPhone avec puce A17 Pro", 2890, 2690.0, 25,
                List.of("https://placehold.co/600x600/1a1a2e/white?text=iPhone+15", "https://placehold.co/600x600/16213e/white?text=iPhone+Back"),
                Set.of(electronics, phones));

        createProduct(sp, "Samsung Galaxy S24 Ultra", "Smartphone Samsung avec S Pen intégré", 2590, null, 30,
                List.of("https://placehold.co/600x600/0f3460/white?text=Galaxy+S24"),
                Set.of(electronics, phones));

        createProduct(sp, "MacBook Pro M3", "MacBook Pro 14 pouces avec puce M3", 3990, 3790.0, 15,
                List.of("https://placehold.co/600x600/533483/white?text=MacBook+Pro"),
                Set.of(electronics, laptops));

        createProduct(sp, "Dell XPS 15", "Ultrabook premium avec écran OLED", 2890, null, 20,
                List.of("https://placehold.co/600x600/2c3e50/white?text=Dell+XPS"),
                Set.of(electronics, laptops));

        createProduct(sp, "AirPods Pro 2", "Écouteurs sans fil avec réduction de bruit", 490, 440.0, 50,
                List.of("https://placehold.co/600x600/e94560/white?text=AirPods"),
                Set.of(electronics));

        createProduct(sp, "PlayStation 5", "Console de jeux nouvelle génération", 1290, null, 10,
                List.of("https://placehold.co/600x600/0a1128/white?text=PS5"),
                Set.of(electronics));

        createProduct(sp, "Montre Connectée Pro", "Smartwatch avec suivi santé avancé", 350, 290.0, 40,
                List.of("https://placehold.co/600x600/1b1b2f/white?text=SmartWatch"),
                Set.of(electronics));

        createProduct(sp, "Sac à Dos Premium", "Sac à dos en cuir pour laptop", 120, null, 60,
                List.of("https://placehold.co/600x600/362222/white?text=Sac+Premium"),
                Set.of(fashion));

        Coupon coupon = new Coupon();
        coupon.setCode("WELCOME10");
        coupon.setType(CouponTypeEnum.PERCENT);
        coupon.setValeur(10);
        coupon.setDateExpiration(Instant.now().plusSeconds(86400 * 365));
        coupon.setUsageMax(100);
        coupon.setUsageActuels(0);
        coupon.setActif(ActifEnum.ACTIVE);
        couponRepository.save(coupon);

        Coupon coupon2 = new Coupon();
        coupon2.setCode("FLAT50");
        coupon2.setType(CouponTypeEnum.FIXED);
        coupon2.setValeur(50);
        coupon2.setDateExpiration(Instant.now().plusSeconds(86400 * 365));
        coupon2.setUsageMax(50);
        coupon2.setUsageActuels(0);
        coupon2.setActif(ActifEnum.ACTIVE);
        couponRepository.save(coupon2);
    }

    private void createProduct(SellerProfile seller, String nom, String desc, double prix,
                                Double promo, int stock, List<String> images, Set<Category> categories) {
        Product p = new Product();
        p.setSeller(seller);
        p.setNom(nom);
        p.setDescription(desc);
        p.setPrix(prix);
        p.setPrixPromo(promo);
        p.setStock(stock);
        p.setActif(true);
        p.setDateCreation(Instant.now());
        p.setImages(images);
        p.setCategories(categories);
        productRepository.save(p);
    }
}
