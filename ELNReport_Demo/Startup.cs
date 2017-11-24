using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ELNReport_Demo.Startup))]
namespace ELNReport_Demo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
