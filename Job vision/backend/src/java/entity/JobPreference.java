public class JobPreference {
    
}
@Entity
public class JobPreference {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


@ManyToOne
private User user;


private String skills; // AWS,Docker,K8s
private String location;
private String jobType;
private String experience;
}