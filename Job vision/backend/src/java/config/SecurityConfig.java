@EnableWebSecurity
public class SecurityConfig {


@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
http
.csrf().disable()
.authorizeHttpRequests()
.requestMatchers("/api/auth/**").permitAll()
.anyRequest().authenticated()
.and()
.addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class);


return http.build();
}
}