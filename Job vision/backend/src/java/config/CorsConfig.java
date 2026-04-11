@Configuration
public class CorsConfig {


@Value("${frontend.url}")
private String frontendUrl;


@Bean
public CorsFilter corsFilter() {
CorsConfiguration config = new CorsConfiguration();
config.setAllowCredentials(true);
config.setAllowedOrigins(List.of(frontendUrl));
config.setAllowedHeaders(List.of("*") );
config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));


UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
source.registerCorsConfiguration("/**", config);
return new CorsFilter(source);
}
}