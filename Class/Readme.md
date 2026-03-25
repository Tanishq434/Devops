# 🚀 Kubernetes Apache Web App (httpd)

## 📌 Objective

This project demonstrates how to deploy and manage a simple Apache web application using Kubernetes.
It includes running pods, creating deployments, scaling, debugging, and observing self-healing behavior.

---

## ⚙️ Prerequisites

* Docker Desktop (Kubernetes enabled)
* kubectl installed
* VS Code (optional)

---

## 🚀 Step 1: Run a Pod

```bash
kubectl run apache-pod --image=httpd
kubectl get pods
```

✔ A pod running Apache server is created.

---

## 🔍 Step 2: Inspect Pod

```bash
kubectl describe pod apache-pod
```

✔ Shows container details, ports, and events.

---

## 🌐 Step 3: Access the Application

```bash
kubectl port-forward pod/apache-pod 8081:80
```

Open in browser:

```
http://localhost:8081
```

✔ Apache default page ("It works!") is displayed.

---

## ❌ Step 4: Delete Pod

```bash
kubectl delete pod apache-pod
```

✔ Pod gets deleted permanently (no self-healing).

---

## 🔁 Step 5: Create Deployment

```bash
kubectl create deployment apache --image=httpd
kubectl get deployments
kubectl get pods
```

✔ Deployment manages pods automatically.

---

## 🌍 Step 6: Expose Deployment

```bash
kubectl expose deployment apache --port=80 --type=NodePort
kubectl port-forward service/apache 8082:80
```

Open:

```
http://localhost:8082
```

✔ Application is accessible via service.

---

## 📈 Step 7: Scale Deployment

```bash
kubectl scale deployment apache --replicas=2
kubectl get pods
```

✔ Multiple pods run the same application.

---

## ⚖️ Step 8: Load Distribution

* Refresh browser multiple times
* Requests are handled by different pods
* Output appears same but backend pods differ

---

## 🐞 Step 9: Debugging

### Break the Application

```bash
kubectl set image deployment/apache httpd=wrongimage
kubectl get pods
```

✔ Error observed: `ImagePullBackOff`

---

### Diagnose

```bash
kubectl describe pod <pod-name>
```

---

### Fix the Issue

```bash
kubectl set image deployment/apache httpd=httpd
```

✔ Application returns to normal.

---

## 🔍 Step 10: Access Container

```bash
kubectl exec -it <pod-name> -- /bin/sh
cd /usr/local/apache2/htdocs
```

---

## ✏️ Modify Application

```bash
echo "<h1>Hello from Kubernetes 🚀</h1>" > index.html
```

✔ Changes reflected in browser.

⚠️ Note: Changes are temporary and lost if pod restarts.

---

## ♻️ Step 11: Self-Healing

```bash
kubectl delete pod <pod-name>
kubectl get pods -w
```

✔ Pod is automatically recreated by deployment.

---

## 🧹 Cleanup

```bash
kubectl delete deployment apache
kubectl delete service apache
```

---

## 📸 Screenshots

Go to the screenshots folder in the class folder in github


---

## 🧠 Key Learnings

* Difference between Pod and Deployment
* Kubernetes self-healing
* Scaling applications
* Load balancing via services
* Debugging errors
* Container file system access

---

## ✅ Conclusion

This project helped in understanding core Kubernetes concepts by deploying and managing a simple Apache web application.
