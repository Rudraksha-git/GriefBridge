import dns from "dns";

dns.resolve4("pooled.db.prisma.io", (err, addresses) => {
  if (err) {
    console.error("IPv4 resolution failed:", err);
  } else {
    console.log("IPv4 addresses:", addresses);
  }
});

dns.resolve6("pooled.db.prisma.io", (err, addresses) => {
  if (err) {
    console.error("IPv6 resolution failed:", err);
  } else {
    console.log("IPv6 addresses:", addresses);
  }
});

dns.lookup("pooled.db.prisma.io", (err, address, family) => {
  if (err) {
    console.error("Standard lookup failed:", err);
  } else {
    console.log("Standard lookup address:", address, "Family: IPv", family);
  }
});
